import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Auth/Login.jsx';
import Register from './components/Auth/Register.jsx';
import Profile from './components/Profile/Profile.jsx';
import Chat from './components/Community/Chat.jsx';
import CommunityList from './components/Community/CommunityList.jsx';
import AdminPanel from './components/Admin/AdminPanel.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/communities" element={<CommunityList />} />
        <Route path="/community/:id" element={<Chat />} /> 
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
