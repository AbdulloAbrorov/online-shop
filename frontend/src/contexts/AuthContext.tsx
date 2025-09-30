import { createContext } from 'react';
import { AuthContextType } from './type-auth-context';


export const AuthContext = createContext<AuthContextType | undefined>(undefined);




