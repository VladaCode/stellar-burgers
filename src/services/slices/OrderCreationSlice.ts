import { getOrderByNumberApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

// Типизация состояния заказа
type TOrderState = {
  order: TOrder | null;
  orderNumber: TOrder | null;
  loading: boolean;
  error: null | string | undefined;
};
// Начальное состояние
export const initialState: TOrderState = {
  order: null,
  orderNumber: null,
  loading: false,
  error: null
};
// Асинхронный thunk для отправки заказа
export const sendOrder = createAsyncThunk(
  'order/sendOrder',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients); // Отправка запроса на сервер с массивом id ингредиентов
    return response; // Отправка запроса на сервер с массивом id ингредиентов
  }
);

// Асинхронный thunk для получения заказа по номеру
export const getOrderNumber = createAsyncThunk(
  'order/getOrderNumber',
  async (number: number) => getOrderByNumberApi(number) // Получение информации о заказе по номеру
);

// Создание slice для управления состоянием заказа
const orderCreationSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // Сброс заказа
    clearOrder: (state) => {
      state.order = null; // Очищаем текущий заказ
    }
  },
  // Обработка состояний асинхронного экшена sendOrder
  extraReducers: (builder) => {
    builder
      // Переход в состояние загрузки при отправке заказа
      .addCase(sendOrder.pending, (state) => {
        state.order = null; // Сбрасываем предыдущий заказ
        state.loading = true; // Устанавливаем флаг загрузки
        state.error = null; // Очищаем ошибку
      })
      // Обработка ошибки при отправке заказа
      .addCase(sendOrder.rejected, (state) => {
        state.loading = false; // Отключаем флаг загрузки
        state.error = 'Ошибка'; // Устанавливаем сообщение об ошибке
      })
      .addCase(sendOrder.fulfilled, (state, action) => {
        state.order = action.payload.order; // Обработка успешной отправки заказа
        state.loading = false; // Отключаем флаг загрузки
        state.error = null; // Очищаем ошибку
      })
      // Переход в состояние загрузки при получении заказа по номеру
      .addCase(getOrderNumber.pending, (state) => {
        state.loading = true; // Устанавливаем флаг загрузки
        state.error = null; // Очищаем ошибку
      })
      // Обработка успешного получения заказа по номеру
      .addCase(getOrderNumber.fulfilled, (state, action) => {
        state.loading = false; // Отключаем флаг загрузки
        state.orderNumber = action.payload.orders[0]; // Сохраняем информацию о заказе
        state.error = null; // Очищаем ошибку
      })
      // Обработка ошибки при получении заказа по номеру
      .addCase(getOrderNumber.rejected, (state) => {
        state.order = null; // Сбрасываем текущий заказ
        state.loading = false; // Отключаем флаг загрузки
        state.error = 'Ошибка'; // Устанавливаем сообщение об ошибке
      });
  },
  // Селекторы для получения данных из состояния
  selectors: {
    getOrderSelector: (state) => state.order, // Получение текущего заказа
    getOrderNumberSelector: (state) => state.orderNumber, // Получение информации о заказе по номеру
    getLoadingSelector: (state) => state.loading, // Получение флага загрузки
    getErrorSelector: (state) => state.error // Получение сообщения об ошибке
  }
});

// Экспорт редьюсера для использования в хранилище
export const orderSliceReducer = orderCreationSlice.reducer;
export const orderSliceInitialState = initialState;
export const { clearOrder } = orderCreationSlice.actions;
export const {
  getOrderSelector,
  getOrderNumberSelector,
  getLoadingSelector,
  getErrorSelector
} = orderCreationSlice.selectors;
export default orderCreationSlice;
