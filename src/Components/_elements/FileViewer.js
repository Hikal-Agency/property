import React from 'react';

const FileViewer = ({ closeModal, docUrl }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <button
          className="absolute top-4 right-4 text-white"
          onClick={closeModal}
        >
          Close
        </button>
        <iframe
            src={docUrl}
            title="File Viewer"
            className="w-full h-full"
        />
      </div>
    );
  };

export default FileViewer;
