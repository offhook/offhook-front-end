import React, { Component } from 'react';
import './App.css';
import Search from './Search';
import logo from '../logo-full-size.png';

const API_ADDRESS = 'http://localhost:8080';

class App extends Component {

  state = { sources: {} }

  componentDidMount() {
    this.fetchSupportedSources();
  }

  fetchSupportedSources() {
    fetch(`${API_ADDRESS}/sources`)
      .then(response => response.json())
      .then(json => this.setState({sources: json}));
  }

  searchPackage = (packageQuery, source, os, arch) => {
    console.log(packageQuery);
    console.log(source);
    console.log(os);
    console.log(arch);
  };

  render() {
    return (
      <div className="App">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="page-content">
          <Search sources={this.state.sources} searchPackage={this.searchPackage}/>
        </div>
      </div>
    );
  }
}

export default App;
