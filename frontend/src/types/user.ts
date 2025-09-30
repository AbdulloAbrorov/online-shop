
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