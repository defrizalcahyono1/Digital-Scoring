import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useStore } from './useStore';

interface TokenPayload {
  exp: number;
}

export const useAutoLogout = () => {
  const navigate = useNavigate();
  const { setUser } = useStore();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) return;

    try {
      const decoded = jwtDecode<TokenPayload>(token);

      const currentTime = Date.now() / 1000;
      const expireTime = decoded.exp;

      const timeUntilExpire = (expireTime - currentTime) * 1000;

      if (timeUntilExpire <= 0) {
        handleLogout();
      } else {
        const timeoutId = setTimeout(() => {
          handleLogout();
        }, timeUntilExpire);

        return () => clearTimeout(timeoutId);
      }
    } catch (error) {
      console.error("Failed to decode token", error);
      handleLogout();
    }

    function handleLogout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      navigate('/login');
    }
  }, [navigate, setUser]);
};
