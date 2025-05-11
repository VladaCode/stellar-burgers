import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { getIngredientsWithSelector } from '../../services/slices/IngredientsSlice';
import { useParams } from 'react-router-dom';
import {
  getOrderNumber,
  getOrderNumberSelector
} from '../../services/slices/OrderCreationSlice';

// Компонент для отображения информации о заказе
export const OrderInfo: FC = () => {
  const orderData = useSelector(getOrderNumberSelector); // Получаем данные заказа из стора
  const id = useParams().number; // Получаем id заказа из параметров маршрута
  const dispatch = useDispatch(); // Инициализация dispatch с типизацией

  useEffect(() => {
    // При монтировании компонента диспатчим экшен для получения данных заказа
    dispatch(getOrderNumber(Number(id)));
  }, [dispatch, id]);

  const ingredients: TIngredient[] = useSelector(getIngredientsWithSelector); // Получаем список всех ингредиентов из стора

  // Формируем данные для отображения, только когда приходят orderData и ingredients
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null; // Если данных нет, возвращаем null

    const date = new Date(orderData.createdAt); // Преобразуем строку даты из заказа в объект Date

    type TIngredientsWithCount = {
      // Тип для словаря ингредиентов с подсчётом количества
      [key: string]: TIngredient & { count: number };
    };
    // Проходим по списку id ингредиентов из заказа и собираем данные об ингредиентах + количество
    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );
    // Проходим по списку id ингредиентов из заказа и собираем данные об ингредиентах + количество
    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );
    // Возвращаем итоговый объект с полной информацией для UI
    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]); // зависимости для пересчёта
  //Пока нет данных — показываем прелоадер
  if (!orderInfo) {
    return <Preloader />;
  }
  // Когда данные готовы — рендерим UI-компонент с информацией о заказе
  return <OrderInfoUI orderInfo={orderInfo} />;
};
