import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import CodeEditor from './pages/CodeEditor';
import Documentation from './pages/Documentation';
import Home from './pages/Home';
import MachineEdit from './pages/MachineEdit';
import MachineRun from './pages/MachineRun';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/documentation/:id" element={<Documentation />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/code-editor" element={
          <ProtectedRoute>
            <CodeEditor />
          </ProtectedRoute>
        } />
        <Route path="/machine-edit/:id" element={
          <ProtectedRoute>
            <MachineEdit />
          </ProtectedRoute>
        } />
        <Route path="/machine/:id" element={
          <ProtectedRoute>
            <MachineRun />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
