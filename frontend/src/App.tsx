import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import Default from './components/Default';
import HelloWorld from './components/HelloWorld';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Default />} />
        <Route path="/test" element={<HelloWorld />} />
      </Routes>
    </Router>
  );
}

export default App;
