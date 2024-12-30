import React from 'react';
import Header from './components/User/Header';
import Body from './components/User/Profile/Body';

const UserProfile = () => {
  return (
    <div className="h-screen w-full overflow-y-hidden">
      <Header className="z-10" />
      <div className="h-full">
      <Body className="z-0"  />
      </div>
    </div>
  );
};

export default UserProfile;
