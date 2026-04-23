import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const url = import.meta.env.VITE_API_URL;

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // check if user is still logged in on page load/refresh
  useEffect(() => {
    axios.get(`${url}/api/auth/me`)
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await axios.post(`${url}/api/auth/logout`);
    } catch (err) {
      // logout even if the request fails
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
