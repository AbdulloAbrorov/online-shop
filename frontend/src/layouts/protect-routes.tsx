
import {Navigate } from 'react-router-dom';

import { useAuth } from '../contexts/use-auth';

import { ReactNode } from 'react';



export const ProtectedRoute = ({ children, adminOnly = false }: { children: ReactNode, adminOnly?: boolean }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
};
