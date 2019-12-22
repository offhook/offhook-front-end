import React, { Component } from 'react';

class Search extends Component {
  state = { packageQuery: '', source: '', os: '', arch: '' };

  sources = [{ id: 'yum', name: 'YUM' }];
  operatingSystems = [{ id: 'el7', name: 'RHEL/CentOS 7' }];
  architectures = [
    { id: 'x86_64', name: 'x86_64' },
    { id: 'i686', name: 'i686' },
  ];

  componentDidMount() {
    this.setState({
      source: this.sources[0].id,
      os: this.operatingSystems[0].id,
      arch: this.architectures[0].id,
    });
  }

  updatePackageQuery = event => {
    this.setState({ packageQuery: event.target.value });
  };

  updateSource = event => {
    this.setState({ source: event.target.value });
  };

  updateOS = event => {
    this.setState({ os: event.target.value });
  };

  updateArch = event => {
    this.setState({ arch: event.target.value });
  };

  handleKeyPress = event => {
    if (event.key === 'Enter') {
      this.searchPackage();
    }
  };

  searchPackage = () => {
    this.props.searchPackage(this.state.packageQuery, this.state.source, this.state.os, this.state.arch);
  };

  render() {
    const containerStyle = {display: 'flex', justifyContent: 'center'};
    const otherInputsStyle = {flexGrow: 0.2};
    const otherLabelsStyle = {flexGrow: 0.05};

    return (
      <div className="input-group" style={containerStyle}>

        <input type="text"
               className="form-control"
               placeholder="Package name here"
               onChange={this.updatePackageQuery}
               onKeyPress={this.handleKeyPress}
        />

        <span className="input-group-text form-control" style={otherLabelsStyle}>from</span>
        <select className="custom-select"
                style={otherInputsStyle}
                onChange={this.updateSource}>
          {
            this.sources.map(option => (<option value={option.id} key={option.id}>{option.name}</option>))
          }
        </select>

        <span className="input-group-text form-control" style={otherLabelsStyle}>for</span>
        <select className="custom-select"
                style={otherInputsStyle}
                onChange={this.updateOS}>
          {
            this.operatingSystems.map(option => (<option value={option.id} key={option.id}>{option.name}</option>))
          }
        </select>

        <select className="custom-select"
                style={otherInputsStyle}
                onChange={this.updateArch}>
          {
            this.architectures.map(option => (<option value={option.id} key={option.id}>{option.name}</option>))
          }
        </select>

        <div className="input-group-append">
          <button className="btn btn-primary" type="button" onClick={this.searchPackage}>Search</button>
        </div>

      </div>

  );
  }
}

export default Search;
