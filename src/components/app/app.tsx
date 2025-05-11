import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  Route,
  Routes,
  useLocation,
  useMatch,
  useNavigate
} from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchIngredients,
  getLoadingSelector
} from '../../services/slices/IngredientsSlice';
import { useEffect } from 'react';
import { Preloader } from '@ui';
import {
  checkUserAuth,
  getIsAuthCheckedSelector
} from '../../services/slices/UserProfileSlice';
import { OnlyAuth, OnlyUnAuth } from '../protected-route/protected-route';

const App = () => {
  const navigate = useNavigate(); // Инициализируем хук для навигации
  const location = useLocation(); // Инициализируем хук для получения текущего местоположения
  const dispatch = useDispatch(); // Инициализируем хук для работы с хранилищем
  const loading = useSelector(getLoadingSelector); // Получение состояния загрузки

  const background = location.state?.background; // Проверяем, была ли навигация с background — используется для отображения модальных окон
  // Получаем номер заказа из URL, если пользователь открыл заказ из профиля или ленты
  const profileMatch = useMatch('/profile/orders/:number')?.params.number;
  const feedMatch = useMatch('/feed/:number')?.params.number;
  const orderNumber = profileMatch || feedMatch;

  // При первом рендере запрашиваем ингредиенты и проверяем авторизацию с сервера
  useEffect(() => {
    dispatch(fetchIngredients()); // Запрос на получение ингредиентов
    dispatch(checkUserAuth()); // Проверка авторизации
  }, [dispatch]);

  const content = () => (
    <>
      <Routes location={background || location}>
        {/* Основные роуты */}
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/feed/:number'
          element={
            <div className={styles.detailPageWrap}>
              <p
                className={`text text_type_digits-default ${styles.detailHeader}`}
              >
                #{orderNumber && orderNumber.padStart(6, '0')}
              </p>
              <OrderInfo />
            </div>
          }
        />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/profile/orders/:number' element={<OrderInfo />} />
        {/* Защищённые роуты */}
        <Route path='/login' element={<OnlyUnAuth component={<Login />} />} />
        <Route
          path='/register'
          element={<OnlyUnAuth component={<Register />} />}
        />
        <Route
          path='/forgot-password'
          element={<OnlyUnAuth component={<ForgotPassword />} />}
        />
        <Route
          path='/reset-password'
          element={<OnlyUnAuth component={<ResetPassword />} />}
        />
        <Route path='/profile' element={<OnlyAuth component={<Profile />} />} />
        <Route
          path='/profile/orders'
          element={<OnlyAuth component={<ProfileOrders />} />}
        />
        {/* 404 */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Отображение модальных окон поверх background-страницы */}
      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title={`#${orderNumber}`} onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal title={`#${orderNumber}`} onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </>
  );

  return (
    <div className={styles.app}>
      <AppHeader /> {/* Шапка приложения */}
      {!loading ? content() : <Preloader />}
      {/* Показываем загрузку или основной контент */}
    </div>
  );
};

export default App;
