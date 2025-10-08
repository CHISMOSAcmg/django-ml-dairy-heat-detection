import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axiosConfig'; // <--- Importa tu instancia de Axios

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  // Validar token y obtener usuario autenticado al montar la app
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setLoading(false);
          return;
        }
        // Usa la instancia de Axios configurada
        const response = await api.get('/auth/user/');
        setUser(response.data);
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  // Login
  const login = async (credentials) => {
    try {
      const response = await api.post('/login/', credentials);
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      let msg = "Usuario o contraseña incorrectos";
      if (error.response && error.response.data && error.response.data.detail) {
        msg = error.response.data.detail;
      }
      return { success: false, message: msg };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
