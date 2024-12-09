import React from 'react';
import './Sidebar.css';
import avatar from './user-avatar.png';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
      <img src={avatar} alt="User Avatar" className="user-avatar" />
        <h2>Root</h2>
      </div>
      <ul className="menu">
        <li className="menu-item">
          <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>📊 Dashboard</Link>
        </li>
        <li className="menu-item">
          <Link to="/income" style={{ textDecoration: 'none', color: 'white' }}>💰 Income</Link>
        </li>
        <li className="menu-item">
          <Link to="/expense" style={{ textDecoration: 'none', color: 'white' }}>📉 Expense</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
