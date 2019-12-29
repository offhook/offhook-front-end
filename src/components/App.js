import React, { Component } from 'react';
import './App.css';
import Search from './Search';
import { SearchResult } from './SearchResults';
import logo from '../logo-full-size.png';

const API_URI = process.env.REACT_APP_API_URI;
const STATUS_UPDATE_INTERVAL_MILLIS = 5000;
const CONTENT_DISPOSITION_FILENAME_RE = new RegExp(/.*filename="(.*)"/gm);

class App extends Component {

  state = {
    sources: {},
    search: {isLoading: false, searchResults: []},
    download: { requestId: null, isReady: false,},
    fullNameToSpec : {},
    fullNameToRequestId : {},
    requestsData: {},
  };

  componentDidMount() {
    this.fetchSupportedSources();
  }

  fetchSupportedSources() {
    fetch(`${API_URI}/sources`)
      .then(response => response.json())
      .then(json => this.setState({sources: json}));
  }

  convertResultsToMapping(results, originalSpec) {

    return results.reduce((map, result) => {
      map[result.fullName] = {
        ...originalSpec,
        packages: [result.fullName],
      };

      return map;
    }, {});
  }

  searchPackage = (packageQuery, source, os, architecture) => {
    this.setState({ search: { ...this.state.search, isLoading: true } });

    const downloadSpec = {
      source,
      os,
      architecture,
      "packages": [
        packageQuery
      ]
    };

    fetch(`${API_URI}/search`, {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(downloadSpec),
    }).then(response => response.json())
      .then(results => this.setState({
        search: { ...this.state.search, searchResults: results, isLoading: false },
        fullNameToSpec: { ...this.state.fullNameToSpec, ...this.convertResultsToMapping(results, downloadSpec) },
      }));
  };

  downloadFiles = (fullName) => {
    const requestId = this.state.fullNameToRequestId[fullName];
    this.downloadFilesByRequestId(requestId);
  };


  downloadFilesByRequestId = (requestId) => {
    fetch(`${API_URI}/download/${requestId}/files`, )
      .then(async (response) => {
        /*
          Browser technology currently doesn't support downloading a file directly from an Ajax request.
            The workaround is to add a hidden form and submit it behind the scenes to get the browser to trigger the Save dialog.
        */
        const contentDispositionHeader = response.headers.get('Content-Disposition');
        const fileName = CONTENT_DISPOSITION_FILENAME_RE.exec(contentDispositionHeader)[1];
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
  };

  submitRequest = (fullName) => {
    const spec = this.state.fullNameToSpec[fullName];
    const reqBody = { spec };
    fetch(`${API_URI}/download`, {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(reqBody),
    }).then(response => response.json())
      .then(({id, status, is_consumable}) => {
        const isReady = is_consumable;
        this.setState({
          fullNameToRequestId: { ...this.state.fullNameToRequestId, [fullName]: id },
          requestsData: { ...this.state.requestsData, [id]: { status, isReady } },
        });

        setTimeout(() => this.updateStatus(id), STATUS_UPDATE_INTERVAL_MILLIS);
      });
  };

  updateStatus = requestId => {
    fetch(`${API_URI}/download/${requestId}`)
      .then(response => response.json())
      .then(({id, status, is_consumable}) => {
        const isReady = is_consumable;
        this.setState({
          requestsData: {...this.state.requestsData, [id]: {status, isReady}},
        });

        if (isReady) {
          this.downloadFilesByRequestId(requestId);
        } else {
          setTimeout(() => this.updateStatus(requestId), STATUS_UPDATE_INTERVAL_MILLIS);
        }
      });
  };

  render() {
    return (
      <div className="App">
        <img src={logo} className="App-logo" alt="logo" />
        <Search sources={this.state.sources} searchPackage={this.searchPackage} />
        {
          this.state.search.isLoading ? (
            <div>
              <span className="spinner-border spinner-border-sm search-spinner" role="status" aria-hidden="true"></span>
              Searching...
            </div>
          ) : (
            <div className="centered-flex-box">
              {
                this.state.search.searchResults.map(({fullName}) => {
                  const requestId = this.state.fullNameToRequestId[fullName];
                  return (
                    <SearchResult key={fullName}
                                  fullName={fullName}
                                  submittedRequest={requestId !== undefined}
                                  status={requestId ? this.state.requestsData[requestId].status : ''}
                                  isReady={requestId ? this.state.requestsData[requestId].isReady : false}
                                  downloadFiles={this.downloadFiles}
                                  submitRequest={this.submitRequest} />
                  )
                })
              }
            </div>
          )
        }
      </div>
    );
  }
}

export default App;
