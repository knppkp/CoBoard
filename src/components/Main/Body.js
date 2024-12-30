import React from 'react';
import ScrollBackground from './ScrollBackground';

const Body = ({status}) => {
  return (
    <div className="bg-basegreen flex-grow flex flex-col items-center w-full">
      <ScrollBackground status={status} />
    </div>
  );
};

export default Body;
