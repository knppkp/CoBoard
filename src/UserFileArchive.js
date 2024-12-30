import React, { useState } from 'react';
import Header from './components/User/Header';
import Body from './components/User/FileArchive/Body';

const UserYourBoard = () => {
  const [searchForumTerm, setSearchForumTerm] = useState('');

  return (
    <div className="h-screen w-full overflow-y-hidden">
      <Header 
        setSearchForumTerm={setSearchForumTerm} 
      />
      <div className="h-full">
        <Body 
          searchForumTerm={searchForumTerm} 
        />
      </div>
    </div>
  );
};

export default UserYourBoard;
