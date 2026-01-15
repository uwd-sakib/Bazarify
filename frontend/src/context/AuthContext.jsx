import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const savedShop = localStorage.getItem('shop');

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      if (savedShop) {
        setShop(JSON.parse(savedShop));
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    setUser(response.data.user);
    setShop(response.data.shop);
    return response;
  };

  const register = async (data) => {
    const response = await authService.register(data);
    setUser(response.data.user);
    setShop(response.data.shop);
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setShop(null);
  };

  const value = {
    user,
    shop,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
