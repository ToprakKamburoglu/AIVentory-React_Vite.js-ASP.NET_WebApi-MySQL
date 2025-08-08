import { createContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

 
  const loadUserFromStorage = useCallback(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (storedUser && token) {
        const parsedUser = JSON.parse(storedUser);
        console.log('Loading user from storage:', parsedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
     
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      console.log('AuthContext: Login attempt for:', email);
      
      const response = await authAPI.login({ email, password });
      console.log('AuthContext: API response:', response.data);
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        
        console.log('AuthContext: Login successful, user:', user);
        console.log('AuthContext: Token:', token);
        
      
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
       
        setUser(user);
        setIsAuthenticated(true);
        
        console.log('AuthContext: State updated, returning success');
        
        return { 
          success: true, 
          user,
          redirectPath: `/${user.role}`
        };
      } else {
        console.log('AuthContext: Login failed:', response.data.message);
        return { 
          success: false, 
          message: response.data.message || 'Giriş başarısız' 
        };
      }
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Sunucu hatası'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
     
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      
      window.location.href = '/login';
    }
  };

 
  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (!token || !storedUser) {
      setUser(null);
      setIsAuthenticated(false);
      return false;
    }
    
    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Invalid user data in storage:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      return false;
    }
  }, []);

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated,
    checkAuth
  };

 
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        <div>
          <div className="loading-spinner lg"></div>
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;