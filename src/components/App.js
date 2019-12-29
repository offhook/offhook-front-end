import React, { Component } from 'react';
import './App.css';
import Search from './Search';
import { SearchResult } from './SearchResults';
import logo from '../logo-full-size.png';

const API_ADDRESS = 'http://localhost:8080';

class App extends Component {

  state = {
    sources: {},
    search: {isLoading: false, searchResults: []},
    download: { requestId: null, isReady: false,},
    nevraStringToSpec : {},
  };

  componentDidMount() {
    this.fetchSupportedSources();
  }

  fetchSupportedSources() {
    fetch(`${API_ADDRESS}/sources`)
      .then(response => response.json())
      .then(json => this.setState({sources: json}));
  }

  convertResultsToMapping(results, originalSpec) {
    console.log(results);

    return results.reduce((map, result) => {
      console.log(result);

      map[result.nevraString] = {
        ...originalSpec,
        packages: [result.nevraString],
      };

      console.log(map);
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

    fetch(`${API_ADDRESS}/search`, {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(downloadSpec),
    }).then(response => response.json())
      .then(results => this.setState({
        search: { ...this.state.search, searchResults: results, isLoading: false },
        nevraStringToSpec: { ...this.state.nevraStringToSpec, ...this.convertResultsToMapping(results, downloadSpec) },
      }));
  };

  downloadPackage = () => {

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
                this.state.search.searchResults.map(result => (
                  <SearchResult key={result.nevraString}
                                nevraString={result.nevraString}
                                downloadPackage={this.downloadPackage}
                                submittedRequest={false}
                                status={''}
                                isReady={false} />
                ))
              }
            </div>
          )
        }
      </div>
    );
  }
}

export default App;
