import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './components/Board/Header';
import Body from './components/Board/Body';

const Board = () => {
  const { board } = useParams();
  const [searchForumTerm, setSearchForumTerm] = useState('');
  
  return (
    <div className="h-screen w-full overflow-y-hidden">
      <Header className="fixed top-0 left-0 right-0 z-10 h-36" setSearchForumTerm={setSearchForumTerm} />
      <div className="h-full mt-2">
        <Body board={board} searchForumTerm={searchForumTerm} />
      </div>
    </div>
  );
};

export default Board;