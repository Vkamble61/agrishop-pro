import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, role }) => {
  // Check if user is authenticated
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) {
    // Not logged in, redirect to appropriate login page
    return <Navigate to={role === 'admin' ? '/admin/login' : '/farmer/login'} replace />;
  }

  // Check if user has the required role
  if (role && user.role !== role) {
    // User doesn't have required role, redirect to their dashboard
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/farmer/dashboard'} replace />;
  }

  // User is authenticated and has correct role
  return children;
};

export default PrivateRoute;

// Made with Bob
