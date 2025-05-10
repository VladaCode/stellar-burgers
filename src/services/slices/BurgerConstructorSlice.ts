import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';

// Тип состояния конструктора бургера
type TStateBurgerConstructor = {
  bun: TConstructorIngredient | null; // выбранная булка
  ingredients: TConstructorIngredient[]; // массив добавленных ингредиентов
};
// Начальное состояние
export const initialState: TStateBurgerConstructor = {
  bun: null,
  ingredients: []
};
// Тип ингредиента с уникальным id (добавляется при добавлении в конструктор)
export type IngredientWithId = TIngredient & { id: string };

// Слайс конструктора бургера
export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    // Добавление ингредиента в конструктор
    addBurgerIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          // если тип "bun", устанавливаем как булку
          state.bun = action.payload;
        } else {
          // иначе добавляем в список ингредиентов
          state.ingredients.push(action.payload);
        }
      },
      // prepare — вспомогательная функция, которая добавляет уникальный id
      prepare: (ingredient: TIngredient) => {
        const id = nanoid();
        return {
          payload: { ...ingredient, id }
        };
      }
    },
    // Удаление ингредиента по id
    removeBurgerIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    // Перемещение ингредиента вверх по списку
    moveUpIngredient: (state, action: PayloadAction<string>) => {
      const current = state.ingredients.findIndex(
        (item) => item.id === action.payload
      );
      if (current > 0) {
        const next = state.ingredients[current];
        state.ingredients[current] = state.ingredients[current - 1];
        state.ingredients[current - 1] = next;
      }
    },
    // Перемещение ингредиента вниз по списку
    moveDownIngredient: (state, action: PayloadAction<string>) => {
      const current = state.ingredients.findIndex(
        (item) => item.id === action.payload
      );
      if (current !== -1 && current < state.ingredients.length - 1) {
        const next = state.ingredients[current];
        state.ingredients[current] = state.ingredients[current + 1];
        state.ingredients[current + 1] = next;
      }
    },
    // Очистка конструктора
    clearBurgerConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  },
  // Селекторы для получения нужных данных из состояния
  selectors: {
    getBurgerIngredientsSelector: (state) => state.ingredients, // получить все ингредиенты
    getBunSelector: (state) => state.bun // получить выбранную булку
  }
});

export const ingredientSliceReducer = burgerConstructorSlice.reducer;
export const { getBurgerIngredientsSelector, getBunSelector } =
  burgerConstructorSlice.selectors;
export default burgerConstructorSlice;
