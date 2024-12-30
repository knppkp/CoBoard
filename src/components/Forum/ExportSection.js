import React, { useRef } from 'react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import Forum from '../../Forum';

const ExportSection = React.forwardRef((props, ref) => {
  const forumRef = useRef(null);

  // Function to trigger export as image
  const exportAsImage = () => {
    if (!forumRef.current) return;
    toPng(forumRef.current, { cacheBust: true, backgroundColor: 'white', width: window.innerWidth, height: window.innerHeight })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'forum-export.png';
        link.click();
      })
      .catch((err) => console.error('Error exporting as image:', err));
  };

  // Function to trigger export as PDF
  const exportAsPDF = () => {
    if (!forumRef.current) return;

    // Capture the forum content
    toPng(forumRef.current, { cacheBust: true, backgroundColor: 'white' })
      .then((dataUrl) => {
        const pdf = new jsPDF('p', 'px', 'a4');  // px unit to define custom size
        const imgProps = pdf.getImageProperties(dataUrl);

        // Get the dimensions of the captured image
        const imgWidth = imgProps.width;
        const imgHeight = imgProps.height;

        // Get the screen size (or the container size) in pixels
        const screenWidth = window.innerWidth;  // Screen width in pixels
        const screenHeight = window.innerHeight;  // Screen height in pixels

        // Create a PDF with the screen size (or content size)
        pdf.internal.pageSize.width = screenWidth;
        pdf.internal.pageSize.height = screenHeight;

        // Add the image to the PDF with the exact screen size
        pdf.addImage(dataUrl, 'PNG', 0, 0, screenWidth, screenHeight);

        // Save the PDF with the custom size
        pdf.save('forum-export.pdf');
      })
      .catch((err) => console.error('Error exporting as PDF:', err));
  };

  return (
    <div className="p-2">
      <h1 className="text-white font-bold text-2xl pl-5 -mb-3">Export</h1>
      <div className="w-480 md:w-500 h-fit bg-lightorange mt-4 rounded-2xl py-2 px-10 flex flex-col items-center">
        <div
          className="flex w-430 h-20 m-1 rounded-2xl items-center hover:bg-white md:hover:scale-105 transform transition-transform duration-200 cursor-pointer"
          onClick={exportAsImage}
        >
          <img
            src="/asset/picture_icon.svg"
            alt="Export as Image"
            className="flex flex-col w-8 h-8 ml-8 md:ml-2"
          />
          <p className="text-blackorange text-2xl font-semibold ml-4">
            Export as Image
          </p>
        </div>
        <div className="my-1 flex justify-center">
          <div className="w-400 md:w-430 h-0.5 bg-darkorange"></div>
        </div>
        <div
          className="flex w-430 h-20 m-1 rounded-2xl items-center hover:bg-white md:hover:scale-105 transform transition-transform duration-200 cursor-pointer"
          onClick={exportAsPDF}
        >
          <img
            src="/asset/pdf_icon.svg"
            alt="Export as PDF"
            className="flex flex-col w-9 h-9 ml-8 md:ml-2"
          />
          <p className="text-blackorange text-2xl font-semibold ml-4">
            Export as PDF
          </p>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100vw', // Full viewport width
          height: '100vh', // Full viewport height
          zIndex: -9999, // Ensure it doesn't appear on top of the UI
        }}
      >
        <Forum ref={forumRef} />
      </div>
    </div>
  );
});

export default ExportSection;
