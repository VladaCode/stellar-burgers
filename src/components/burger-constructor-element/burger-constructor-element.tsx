import { FC, memo } from 'react';
import { useDispatch } from '../../services/store';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import burgerConstructorSlice from '../../services/slices/BurgerConstructorSlice';

// Компонент одного ингредиента в списке конструктора бургера
export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    // Обработчик для перемещения ингредиента вниз по списку
    const handleMoveDown = () => {
      // Нельзя двигать вниз последний элемент
      if (index < totalItems - 1) {
        dispatch(
          burgerConstructorSlice.actions.moveDownIngredient(ingredient.id)
        );
      }
    };
    // Обработчик для перемещения ингредиента вверх по списку
    const handleMoveUp = () => {
      // Нельзя двигать вверх первый элемент
      if (index > 0) {
        dispatch(
          burgerConstructorSlice.actions.moveUpIngredient(ingredient.id)
        );
      }
    };
    // Обработчик для удаления ингредиента
    const handleClose = () => {
      dispatch(
        burgerConstructorSlice.actions.removeBurgerIngredient(ingredient.id)
      );
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
