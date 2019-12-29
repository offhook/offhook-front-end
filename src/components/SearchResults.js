import React from 'react';

const SearchResult = ({submittedRequest, isReady, status, nevraString, downloadFiles, submitRequest}) => {
  const isRequestProcessing = submittedRequest && !isReady;

  let buttonText;
  if (submittedRequest) {
    if (isReady) {
      buttonText = 'Get files';
    } else {
      buttonText = status;
    }
  } else {
    buttonText = 'Download';
  }

  return (
    <div key={nevraString} className="centered-flex-box search-result-box">
      <span className="package-name" style={{flexGrow: 3}}>{nevraString}</span>
      <div className="download-button">
        <button className={"btn btn-primary"}
                disabled={isRequestProcessing}
                onClick={() => isReady ? downloadFiles(nevraString) : submitRequest(nevraString)}>
          {
            isRequestProcessing ? (
              <span className="spinner-border spinner-border-sm request-process-spinner" role="status" aria-hidden="true"></span>
            ) : null
          }

          { buttonText }
        </button>
      </div>

    </div>
  );
};

export { SearchResult };
