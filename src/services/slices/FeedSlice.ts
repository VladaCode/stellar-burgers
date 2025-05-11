import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

// Тип состояния для ленты заказов
type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: null | string | undefined;
};
// Начальное состояние
const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};
// Асинхронный thunk для получения данных заказов с сервера
export const getFeeds = createAsyncThunk('feed/fetchFeeds', async () => {
  const response = await getFeedsApi();
  return response;
});
// Слайс состояния ленты заказов
const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        // Обработка состояния во время запроса
        state.loading = true; // Показываем индикатор загрузки
        state.error = null; // Сброс ошибки при новом запросе
      })
      .addCase(getFeeds.rejected, (state, action) => {
        // Обработка ошибки при запросе
        state.loading = false; // Прячем индикатор загрузки
        state.error = action.error.message; // Сохраняем текст ошибки
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        // Обработка успешного получения данных
        state.loading = false; // Отключаем загрузку
        state.orders = action.payload.orders; // Сохраняем заказы
        state.total = action.payload.total; // Сохраняем общее количество
        state.totalToday = action.payload.totalToday; // Сохраняем количество за сегодня
      });
  },
  selectors: {
    // Селекторы для доступа к нужным частям состояния из компонентов
    getOrdersSelector: (state) => state.orders, // Получение заказов
    getTotalSelector: (state) => state.total, // Получение общего количества заказов
    getTotalTodaySelector: (state) => state.totalToday, // Получение количества заказов за сегодня
    getLoadingSelector: (state) => state.loading, // Получение флага загрузки
    getErrorSelector: (state) => state.error // Получение флага ошибки
  }
});

export const feedSliceReducer = feedSlice.reducer;
export const {
  getOrdersSelector,
  getTotalSelector,
  getTotalTodaySelector,
  getLoadingSelector,
  getErrorSelector
} = feedSlice.selectors;
export default feedSlice;
