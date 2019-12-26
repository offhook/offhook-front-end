import React, { Component } from 'react';
import './App.css';
import Search from './Search';
import logo from '../logo-full-size.png';

const API_ADDRESS = 'http://localhost:8080';

class App extends Component {

  state = { sources: {}, isLoading: false, searchResults: [] }

  componentDidMount() {
    this.fetchSupportedSources();
  }

  fetchSupportedSources() {
    fetch(`${API_ADDRESS}/sources`)
      .then(response => response.json())
      .then(json => this.setState({sources: json}));
  }

  searchPackage = (packageQuery, source, os, architecture) => {
    this.setState({ isLoading: true });
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
      .then(json => this.setState({ searchResults: json }))
      .then(() => this.setState({ isLoading: false }));
  };

  render() {
    const loadingBar =  this.state.isLoading ? (
      <div>LOADING</div>
    ) : null;

    return (
      <div className="App">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="page-content">
          <Search sources={this.state.sources} searchPackage={this.searchPackage}/>
        </div>
        { loadingBar }
        <div>
        {
          this.state.searchResults.map(result => (
            <div key={result.nevraString}>{result.nevraString}</div>
          ))
        }
        </div>
      </div>
    );
  }
}

export default App;
