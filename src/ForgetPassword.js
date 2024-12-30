import React from 'react';
import Header from './components/ForgetPassword/Header';
import Body from './components/ForgetPassword/Body';

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