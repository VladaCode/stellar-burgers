import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import burgerConstructorSlice, {
  getBunSelector,
  getBurgerIngredientsSelector
} from '../../services/slices/BurgerConstructorSlice';
import orderCreationSlice, {
  getOrderSelector,
  sendOrder,
  getLoadingSelector
} from '../../services/slices/OrderCreationSlice';
import { useNavigate } from 'react-router-dom';
import { getUserSelector } from '../../services/slices/UserProfileSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Инициализируем хук для навигации

  // Получаем ингредиенты из стора
  const ingredients = useSelector(getBurgerIngredientsSelector);
  const bun = useSelector(getBunSelector);

  const constructorItems = { ingredients, bun }; // Объединяем в один объект, чтобы было удобнее передавать в пропсы и использовать

  const user = useSelector(getUserSelector); // Получаем пользователя из Redux

  const orderRequest = useSelector(getLoadingSelector); // Получаем из Redux информацию, загружается ли сейчас заказ
  const orderModalData = useSelector(getOrderSelector); // Получаем данные по текущему заказу

  // Обработчик клика по кнопке "Оформить заказ"
  const onOrderClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      if (!constructorItems.bun || orderRequest) return;
      // Собираем массив id всех ингредиентов, включая булку дважды (сверху и снизу)
      const ingredientIds = [
        constructorItems.bun._id,
        ...constructorItems.ingredients.map((item) => item._id), // Собираем массив id всех ингредиентов
        constructorItems.bun._id
      ];

      // Диспатчим thunk для отправки заказа
      dispatch(sendOrder(ingredientIds));
    }
  };

  // Обработчик закрытия модального окна заказа — очищаем конструктор
  const closeOrderModal = () => {
    dispatch(burgerConstructorSlice.actions.clearBurgerConstructor());
    dispatch(orderCreationSlice.actions.clearOrder());
  };

  // Вычисляем общую цену бургера: булка ×2 + сумма начинок
  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems] // пересчитывается только при изменении булки или ингредиентов
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
