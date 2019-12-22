import React, { Component } from 'react';
import './App.css';
import Search from './Search';
import logo from '../logo-full-size.png';

class App extends Component {

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
          <Search className="" searchPackage={this.searchPackage}/>
        </div>
      </div>
    );
  }
}

export default App;
