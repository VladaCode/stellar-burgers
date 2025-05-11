import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch } from '../../services/store';
import ingredientSliceReducer from '../../services/slices/BurgerConstructorSlice';

// Компонент одного ингредиента в списке ингредиентов
export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation(); // Получаем текущую локацию для возможности открытия модального окна с ингредиентом
    // Получаем функцию dispatch для отправки экшенов
    const dispatch = useDispatch();
    // Обработчик добавления ингредиента в конструктор
    const handleAdd = () => {
      dispatch(ingredientSliceReducer.actions.addBurgerIngredient(ingredient));
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
