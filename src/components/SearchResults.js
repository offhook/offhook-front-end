import React from 'react';

const SearchResults = props => {
  return props.isLoading ? (
    <div>LOADING</div>
  ) : (
    <div className="centered-flexbox">
      {
        props.results.map(result => (
          <div key={result.nevraString}>
            <span className="package-name" style={{flexGrow: 3}}>{result.nevraString}</span>
            <span className="download-button">Download btn</span>
          </div>
        ))
      }
    </div>
  );
};

export default SearchResults;
