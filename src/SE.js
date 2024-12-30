import React from 'react';
import Header from './components/SE/Header';
import Body from './components/SE/Body';
import Footer from './components/SE/Footer';

const SE = () => {
  return (
    <div className="flex flex-col h-screen w-full">
      {/* Header with shadow and background */}
      <Header 
        className="sticky top-0 left-0 right-0 z-10 p-4" 
      />

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto">
        <Body />
        <Footer />
      </div>
    </div>
  );
};

export default SE;
