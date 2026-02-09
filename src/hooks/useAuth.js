import { useEffect, useMemo, useState } from 'react';
import { authService } from '../services/api';

export const useAuth = () => {
  const [userInfo, setUserInfo] = useState(() => {
    const raw = localStorage.getItem('userInfo');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (userInfo) localStorage.setItem('userInfo', JSON.stringify(userInfo));
    else localStorage.removeItem('userInfo');
  }, [userInfo]);

  const login = async ({ email, password }) => {
    const { data } = await authService.login({ email, password });
    setUserInfo(data);
    return data;
  };

  const register = async ({ name, email, password, mobile, role }) => {
    const { data } = await authService.register({ name, email, password, mobile, role });
    setUserInfo(data);
    return data;
  };

  const logout = () => setUserInfo(null);

  const value = useMemo(() => ({ userInfo, login, register, logout }), [userInfo]);
  return value;
};
