import { getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

// Создание асинхронного экшена для загрузки заказов пользователя
export const getProfileOrders = createAsyncThunk(
  'profileOrders/getProfileOrders',
  getOrdersApi
);

// Тип состояния хранилища для заказов
type TProfileOrdersState = {
  orders: TOrder[]; // массив заказов
  loading: boolean; // индикатор загрузки
  error: null | string | undefined; // сообщение об ошибке
};
// Начальное состояние
export const initialState: TProfileOrdersState = {
  orders: [],
  loading: false,
  error: null
};
// Начальное состояние
export const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProfileOrders.pending, (state) => {
        state.orders = [];
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfileOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getProfileOrders.rejected, (state, action) => {
        state.orders = [];
        state.loading = false;
        state.error = action.error.message;
      });
  },
  selectors: {
    getOrdersSelector: (state) => state.orders,
    getLoadingSelector: (state) => state.loading,
    getErrorSelector: (state) => state.error
  }
});

export const profileOrdersReducer = profileOrdersSlice.reducer;
export const { getOrdersSelector, getLoadingSelector, getErrorSelector } =
  profileOrdersSlice.selectors;
export default profileOrdersSlice;
