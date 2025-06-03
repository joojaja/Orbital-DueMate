import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import ProtectedRoute from './components/protectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import CalendarDashboard from './pages/CalendarDashboard';
import AuthService from './services/authenticationService';

function App() {
  let isAuthenticated = AuthService.getCurrentUser();

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <CalendarDashboard /> : <Login />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to = "/home"/> : <Login />} />
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
