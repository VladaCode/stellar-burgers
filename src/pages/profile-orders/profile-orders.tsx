import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { FC, useEffect } from 'react';
import {
  getLoadingSelector,
  getOrdersSelector,
  getProfileOrders
} from '../../services/slices/ProfileOrdersSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(getOrdersSelector);
  const loading = useSelector(getLoadingSelector);

  useEffect(() => {
    dispatch(getProfileOrders());
  }, []);

  if (loading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
