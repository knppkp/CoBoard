import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Main from './Main';
import Board from './Board';
import Forum from './Forum';
import SE from './SE'
import Preview from '../src/components/Forum/Preview'
import LoginSignup from './LoginSignup'
import ForgetPassword from './ForgetPassword';
import UserForgetPassword from './UserForgetPassword'
import UserProfile from './UserProfile'
import UserYourBoard from './UserYourBoard'
import UserBookmark from './UserBookmark'
import UserFileArchive from './UserFileArchive'
import './index.css'; // Tailwind CSS


const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('https://coboard-uwrz.onrender.com')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <Router>
      <Routes>
      <Route path="/se" element={<SE />} />
        <Route path="/coboard" element={<Main />} />
        <Route path="/" element={<LoginSignup />} />
        <Route path="/coboard/:board" element={<Board />} />
        <Route path="/coboard/:board/:forum_name" element={<Forum />} />
        <Route path="/preview/:board/:forum_name" element={<Preview />}/>
        <Route path="/forget_password" element={<ForgetPassword />}/>
        <Route path="/user/forget_password" element={<UserForgetPassword />}/>
        <Route path="/user/:id/profile" element={<UserProfile />} />
        <Route path="/user/:id/yourboard" element={<UserYourBoard />} />
        <Route path="/user/:id/yourbookmark" element={<UserBookmark />} />
        <Route path="/user/:id/yourarchive" element={<UserFileArchive />} />
      </Routes>
    </Router>
  );
};

export default App;
