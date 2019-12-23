import React, { Component } from 'react';

class Search extends Component {
  state = {
    packageQuery: '',
    selectedSource: '', selectedOS: '', selectedArch: '',
    sources: {}, operatingSystems: {}, architectures: {}
  };

  componentDidMount() {
    this.reloadSources();
  }

  reloadSources() {
    const sources = this.props.sources;
    const selectedSource = Object.keys(sources)[0];

    if (!sources.hasOwnProperty(selectedSource)) {
      return;
    }

    const operatingSystems = sources[selectedSource].operatingSystems;
    const selectedOS = Object.keys(operatingSystems)[0];

    if (!operatingSystems.hasOwnProperty(selectedOS)) {
      return;
    }

    const architectures = operatingSystems[selectedOS].architectures;
    const selectedArch = Object.keys(architectures)[0];

    this.setState({ sources, selectedSource, operatingSystems, selectedOS, architectures, selectedArch });
  }

  componentDidUpdate(prevProps) {
    if (this.props.sources !== this.state.sources) {
      this.reloadSources();
    }
  }

  updatePackageQuery = event => {
    this.setState({ packageQuery: event.target.value });
  };

  updateSource = event => {
    this.setState({ selectedSource: event.target.value });
  };

  updateOS = event => {
    this.setState({ selectedOS: event.target.value });
  };

  updateArch = event => {
    this.setState({ selectedArch: event.target.value });
  };

  handleKeyPress = event => {
    if (event.key === 'Enter') {
      this.searchPackage();
    }
  };

  searchPackage = () => {
    this.props.searchPackage(this.state.packageQuery, this.state.selectedSource, this.state.selectedOS, this.state.selectedArch);
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
            Object.keys(this.state.sources).map((key, index, array) => (<option value={key} key={key}>{this.state.sources[key].name}</option>))
          }
        </select>

        <span className="input-group-text form-control" style={otherLabelsStyle}>for</span>
        <select className="custom-select"
                style={otherInputsStyle}
                onChange={this.updateOS}>
          {
            Object.keys(this.state.operatingSystems).map((key, index, array) => (<option value={key} key={key}>{this.state.operatingSystems[key].name}</option>))
          }
        </select>

        <select className="custom-select"
                style={otherInputsStyle}
                onChange={this.updateArch}>
          {
            Object.keys(this.state.architectures).map((key, index, array) => (<option value={key} key={key}>{this.state.architectures[key].name}</option>))
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
