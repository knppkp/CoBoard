import React, { useState } from 'react';
import LeftTab from './LeftTab';
import MainBody from './MainBody';

const Body = ({ board, searchForumTerm }) => {
  const [tagfiltered, setTagFiltered] = useState([]);

  return (
    <div className="w-full h-full flex flex-row">
      
      <div className="h-screen sticky top-0">
        <LeftTab board={board} setTagFiltered={setTagFiltered} />
      </div>
      <div className="flex-grow overflow-y-auto mb-40">
        <MainBody board={board} searchForumTerm={searchForumTerm} tagfiltered={tagfiltered} />
      </div>
    </div>
  );
};

export default Body;
