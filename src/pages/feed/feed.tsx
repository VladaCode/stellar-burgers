import { Preloader } from '@ui';
import { useDispatch, useSelector } from 'react-redux';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { getFeeds, getOrdersSelector } from '../../services/slices/FeedSlice';
import { AppDispatch } from 'src/services/store';
import { log } from 'console';

export const Feed: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(getOrdersSelector);
  // При первом рендере загружаем данные
  useEffect(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  // Если заказы еще загружаются — показываем прелоадер
  if (!orders.length) {
    return <Preloader />;
  }
  // Показываем компонент, когда данные загружены
  return <FeedUI orders={orders} handleGetFeeds={() => dispatch(getFeeds())} />;
};
