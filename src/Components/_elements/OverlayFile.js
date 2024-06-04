import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { BsX } from "react-icons/bs";
import pdf from "../../assets/Pdf.pdf";

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const OverlayFile = ({ type, content, onClose, category }) => {
  const [pdfUrl, setPdfUrl] = useState(null);

  console.log("OVERLAY ================== ", content);
  console.log("Category ================== ", category);
  console.log("Pdf URl ================== ", pdfUrl);

  const downloadPDF = () => {
    const downloadLink = document.createElement("a");
    downloadLink.href = pdfUrl;
    downloadLink.download = "downloadedPDF.pdf";
    downloadLink.click();
  };

  const generateTempPdf = () => {
    if (category === "tax") {
      setPdfUrl(content);
      return;
    }
    const url = `data:application/pdf;base64,${content}`;
    setPdfUrl(url);
  };

  useEffect(() => {
    generateTempPdf();
  }, [content]);

  return (
    <div
      className="top-0 left-0 flex items-center justify-center px-5 pt-5"
      style={{
        position: "fixed",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 11,
        overflowY: "scroll",
      }}
      onClick={onClose}
    >
      {/* CLOSE BUTTON  */}
      <div
        className="absolute top-10 right-10 bg-red-600 rounded-full p-2 shadow-md"
        onClick={onClose}
      >
        <BsX size={26} color={"white"} />
      </div>
      {/* <div className='content' onClick={(e) => e.stopPropagation()}> */}
      {type === "pdf" ? (
        <>
          {/* <Document
                        // file={{ url: content }}
                        file={content}
                        // file={{ data: pdf }}
                        onLoadError={(error) => console.error('Failed to load pdf: ', error)}
                        onContextMenu={(e) => e.preventDefault()}
                    >
                    </Document> */}
          <iframe src={pdfUrl} style={{ width: "100%", height: "100%" }} />
        </>
      ) : (
        <img
          onContextMenu={(e) => e.preventDefault()}
          src={content}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        />
      )}

      {/* {numPages && type === "pdf" && (
                <div className='absolute bottom-10 left-10 bg-white text-black font-semibold rounded-full p-2 shadow-md'>
                    <p style={{ color: "white" }}>
                        Page {pageNumber} of {numPages}
                    </p>
                </div>
            )} */}
      {/* </div> */}
    </div>
  );
};

export default OverlayFile;
