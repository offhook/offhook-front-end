import React from 'react';

const SearchResults = props => {
  return props.isLoading ? (
    <div>LOADING</div>
  ) : (
    <div className="centered-flex-box">
      {
        props.results.map(result => (
          <div key={result.nevraString} className="centered-flex-box search-result-box">
            <span className="package-name" style={{flexGrow: 3}}>{result.nevraString}</span>
            <div className="download-button">
              <button className="btn btn-secondary">Download</button>
            </div>

          </div>
        ))
      }
    </div>
  );
};

export default SearchResults;
