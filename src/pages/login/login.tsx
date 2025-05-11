import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  getUserSelector,
  loginUser
} from '../../services/slices/UserProfileSlice';
import { getLoadingSelector } from '../../services/slices/IngredientsSlice';
import { Preloader } from '@ui';
import { useNavigate } from 'react-router-dom';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const loading = useSelector(getLoadingSelector);
  const dispatch = useDispatch();
  const user = useSelector(getUserSelector); // проверяем, есть ли пользователь
  const navigate = useNavigate(); // хук навигации

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  // Перенаправляем на главную, если пользователь залогинен
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true }); // перенаправление
    }
  }, [user, navigate]);

  if (loading) return <Preloader />;

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
