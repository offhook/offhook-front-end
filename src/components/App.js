import React, { Component } from 'react';
import './App.css';
import Search from './Search';
import SearchResults from './SearchResults';
import logo from '../logo-full-size.png';

const API_ADDRESS = 'http://localhost:8080';

class App extends Component {

  state = {
    sources: {},
    search: {isLoading: false, searchResults: []},
    download: { requestId: null, isReady: false,},
  };

  componentDidMount() {
    this.fetchSupportedSources();
  }

  fetchSupportedSources() {
    fetch(`${API_ADDRESS}/sources`)
      .then(response => response.json())
      .then(json => this.setState({sources: json}));
  }

  searchPackage = (packageQuery, source, os, architecture) => {
    this.setState({ search: { ...this.state.search, isLoading: true } });
    fetch(`${API_ADDRESS}/search`, {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        source,
        os,
        architecture,
        "packages": [
          packageQuery
        ]
      }),
    }).then(response => response.json())
      .then(json => this.setState({ search: { ...this.state.search, searchResults: json } }))
      .then(() => this.setState({ search: { ...this.state.search, isLoading: false } }));
  };

  render() {
    return (
      <div className="App">
        <img src={logo} className="App-logo" alt="logo" />
        <Search sources={this.state.sources} searchPackage={this.searchPackage} />
        <SearchResults results={this.state.search.searchResults} isLoading={this.state.search.isLoading} />
      </div>
    );
  }
}

export default App;
