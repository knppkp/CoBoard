import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './components/User/Bookmark/Header';
import Body from './components/User/Bookmark/Body';

const UserYourBoard = () => {
  const [searchForumTerm, setSearchForumTerm] = useState('');
  const { board } = useParams();

  return (
    <div className="h-screen w-full overflow-y-hidden">
      <Header 
        setSearchForumTerm={setSearchForumTerm} 
      />
      <div className="h-full">
        <Body 
          board={board}
          searchForumTerm={searchForumTerm} 
        />
      </div>
    </div>
  );
};

export default UserYourBoard;
