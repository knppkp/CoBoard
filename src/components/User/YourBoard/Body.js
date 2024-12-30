import React from 'react';
import LeftTab from '../LeftTab';
import MainBody from './MainBody';

const Body = ({ board, searchForumTerm }) => {
  return (
    <div className="w-full h-full flex flex-row">
      <div className="h-screen sticky top-0">
        <LeftTab/>
      </div>
      <div className="flex-grow overflow-y-auto">
      <MainBody board={board} searchForumTerm={searchForumTerm} />
      </div>
    </div>
  );
};

export default Body;
