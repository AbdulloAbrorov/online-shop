import { ReactNode } from 'react';

export interface User {
  id: number;
  email: string;
  role: 'ADMIN' | 'USER';
  firstName?: string;
  lastName?: string;
  createdAt?: string;
  updatedAt?: string;
  password?:string;
  
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

export interface NavLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
}

