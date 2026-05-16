import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/global.css';

// Pages
import HomePage from './pages/HomePage';
import FarmerLogin from './pages/FarmerLogin';
import FarmerRegister from './pages/FarmerRegister';
import FarmerDashboard from './pages/FarmerDashboard';
import EquipmentCatalogue from './pages/EquipmentCatalogue';
import FinanceEMI from './pages/FinanceEMI';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import SupplierManagement from './pages/SupplierManagement';
import InventoryManagement from './pages/InventoryManagement';
import CustomerLoyalty from './pages/CustomerLoyalty';
import Reviews from './pages/Reviews';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/reviews" element={<Reviews />} />
            
            {/* Farmer Routes */}
            <Route path="/farmer/login" element={<FarmerLogin />} />
            <Route path="/farmer/register" element={<FarmerRegister />} />
            <Route 
              path="/farmer/dashboard" 
              element={
                <PrivateRoute role="farmer">
                  <FarmerDashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/equipment" 
              element={
                <PrivateRoute role="farmer">
                  <EquipmentCatalogue />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/finance" 
              element={
                <PrivateRoute role="farmer">
                  <FinanceEMI />
                </PrivateRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <PrivateRoute role="admin">
                  <AdminDashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/suppliers" 
              element={
                <PrivateRoute role="admin">
                  <SupplierManagement />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/inventory" 
              element={
                <PrivateRoute role="admin">
                  <InventoryManagement />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/loyalty" 
              element={
                <PrivateRoute role="admin">
                  <CustomerLoyalty />
                </PrivateRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

// Made with Bob
