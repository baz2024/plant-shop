import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Signup from './components/Signup';
import Signin from './components/Signin';
import AdminCategories from './components/AdminCategories'; // ✅ NEW
import CssBaseline from '@mui/material/CssBaseline';
import ProductListPage from './components/ProductListPage';

function App() {
  return (
    <Router>
      <div className="App">
        <CssBaseline />
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin/categories" element={<AdminCategories />} /> 
          <Route path="/products" element={<ProductListPage />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;