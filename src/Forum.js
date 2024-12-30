import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './components/Forum/Header';
import Body from './components/Forum/Body';
import Tab from './components/Forum/Tab';

const Forum = React.forwardRef((props, ref) => {
  const { board, forum_name } = useParams();
  const [searchTopicTerm, setSearchTopicTerm] = useState('');

  return (
    <div ref={ref} className="flex flex-row relative w-full h-screen overflow-hidden">
      <div className="flex flex-col w-full h-full">
        <Header 
          board={board} 
          forum_name={forum_name} 
          setSearchTopicTerm={setSearchTopicTerm} 
          className="fixed top-0 left-0 right-0 z-10" 
        /> 
        <div className="flex-1 overflow-y-auto mt-[calc(header-height)]">
          <Body 
            board={board} 
            forum_name={forum_name} 
            searchTopicTerm={searchTopicTerm}
          />
        </div>
      </div>
      <div className="flex flex-col min-w-screen min-h-screen overflow-hidden">
        <Tab board={board} forum_name={forum_name} />  
      </div> 
    </div>
  );
});

export default Forum;
