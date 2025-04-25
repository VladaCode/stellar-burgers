import { Preloader } from '@ui';
import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import {
  getIsAuthCheckedSelector,
  getUserSelector
} from '../../services/slices/UserProfileSlice';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  component: JSX.Element;
};

export const ProtectedRoute = ({
  onlyUnAuth = false, // true - только неавторизованные, false - только авторизованные
  component
}: TProtectedRouteProps): JSX.Element => {
  const user = useSelector(getUserSelector); // Получаем пользователя из состояния
  const isAuthChecked = useSelector(getIsAuthCheckedSelector); // Проверяем, была ли проверка авторизации
  const location = useLocation(); // Текущее местоположение (URL)

  if (!isAuthChecked) {
    return <Preloader />; //Показываем прелоадер, если ещё не проверили авторизацию
  }

  if (!onlyUnAuth && !user) {
    //Пользователь не авторизован, но доступ только для авторизованных
    return <Navigate to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    //Пользователь авторизован, но маршрут только для НЕавторизованных
    const { from } = location.state ?? { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }
  //onlyUnAuth && !user - для не авторизованного ,  но не авторизован
  // !onlyUnAuth && user - для авторизованного ,  но авторизован
  //Все проверки пройдены — отдаем нужный компонент
  return component;
};

export const OnlyAuth = ProtectedRoute; //обёртка для авторизованных

export const OnlyUnAuth = ({ component }: { component: JSX.Element }) => (
  <ProtectedRoute onlyUnAuth component={component} />
); //обёртка для НЕавторизованных
