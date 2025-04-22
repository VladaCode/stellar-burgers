import { getIngredientsApi } from '../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
// Слай для
// Тип состояния для ингредиентов
type TStateIngredients = {
  ingredients: Array<TIngredient>;
  loading: boolean;
  error: null | string | undefined;
};
// Начальное состояние
const initialState: TStateIngredients = {
  ingredients: [],
  loading: false,
  error: null
};
// Асинхронный thunk для загрузки ингредиентов
export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => {
    const response = await getIngredientsApi(); // Получение данных с API
    return response; // Возврат ответа
  }
);

// Создание слайса с состоянием, редьюсерами и селекторами
const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true; // Устанавливаем флаг загрузки
        state.error = null; // Очищаем ошибку
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false; // Завершаем загрузку
        state.error = action.error.message; // Сохраняем сообщение об ошибке
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false; // Завершаем загрузку
        state.ingredients = action.payload; // Обновляем ингредиенты
      });
  },
  // Селекторы для доступа к данным
  selectors: {
    getIngredientsWithSelector: (sliceState) => sliceState.ingredients, // Получить ингредиенты
    getLoadingSelector: (sliceState) => sliceState.loading // Получить статус загрузки
  }
});

export const ingredientsSliceReducer = ingredientsSlice.reducer;
export const { getIngredientsWithSelector, getLoadingSelector } =
  ingredientsSlice.selectors;
export default ingredientsSlice;
