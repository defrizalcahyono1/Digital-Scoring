import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from './useStore';

export const useAuth = () => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);

  useEffect(() => {
    if (!user) {
        navigate("/login");
      }
    }, [user, navigate]);
};
