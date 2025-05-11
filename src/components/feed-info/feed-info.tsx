import { FC } from 'react';
import { useSelector } from '../../services/store';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';

// Импортируем все нужные селекторы из слайса
import {
  getOrdersSelector,
  getTotalSelector,
  getTotalTodaySelector
} from '../../services/slices/FeedSlice';

// Вспомогательная функция для получения номеров заказов по статусу
const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status) // фильтруем заказы по статусу
    .map((item) => item.number) // извлекаем номера заказов
    .slice(0, 20); // ограничиваем до 20 штук

export const FeedInfo: FC = () => {
  // Получаем массив заказов и общее количество из Redux стора
  const orders: TOrder[] = useSelector(getOrdersSelector);
  const total = useSelector(getTotalSelector);
  const totalToday = useSelector(getTotalTodaySelector);

  // Готовые заказы (выполненные)
  const readyOrders = getOrders(orders, 'done');

  // Заказы в процессе
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={{ total, totalToday }} // Передаём общее количество и количество за сегодня
    />
  );
};
