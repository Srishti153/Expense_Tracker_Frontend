import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Only import Routes and Route
import Sidebar from './components/Sidebar';
import Expense from './components/Expense';
import Income from './components/Income';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="/expense" element={<Expense />} />
          <Route path="/" element={<Dashboard/>} />
          <Route path="/income" element={<Income />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
