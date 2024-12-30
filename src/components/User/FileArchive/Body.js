import React from 'react';
import LeftTab from '../LeftTab';
import MainBody from './MainBody';

const Body = () => {
  return (
    <div className="w-full h-full flex flex-row">
      <div className="h-screen sticky top-0">
        <LeftTab/>
      </div>
      <div className="flex-grow overflow-y-auto">
      <MainBody />
      </div>
    </div>
  );
};

export default Body;
