import React from 'react';
import Header from './components/User/ForgetPassword/Header';
import Body from './components/User/ForgetPassword/Body';

const ForgetPassword = () => { 
  return (
    <div className="h-screen w-full">
      <Header/>
      <div className="h-full">
        <Body />
      </div>
    </div>
  );
};

export default ForgetPassword;