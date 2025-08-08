import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  console.log('useAuth called, context:', context);
  return context;
};

export default useAuth;