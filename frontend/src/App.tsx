import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';

import ProtectedRoute from './components/protectedRoute';
import Default from './components/Default';
import Login from './components/Login';
import Register from './components/Register';
import HomePage from './components/HomePage';
import CalendarDashboard from './components/CalendarDashboard';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/*Protected routes*/}
        <Route element={<ProtectedRoute />}>
          {/* <Route path="/home" element={<HomePage />} /> */}
          <Route path="/home" element={<CalendarDashboard />} />
        </Route>
        {/* <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} /> */}
      </Routes>
    </Router>
  );
}

export default App;
