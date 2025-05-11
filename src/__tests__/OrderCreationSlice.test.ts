import orderCreationSlice, {
  initialState,
  sendOrder,
  getOrderNumber
} from '../services/slices/OrderCreationSlice';

const mockOrder = {
  _id: '681dd2d2c2f30c001cb22912',
  ingredients: ['643d69a5c3f7b9001cfa093c'],
  status: 'done',
  name: 'Краторный бургер',
  createdAt: '2025-05-09T10:02:58.057Z',
  updatedAt: '2025-05-09T10:02:58.862Z',
  number: 76648
};

// Моковые данные для заказа по номеру
const mockOrderNumber = {
  orders: [
    {
      _id: '67890',
      name: 'Заказ по номеру',
      ingredients: ['bun', 'meat', 'sauce'],
      status: 'pending',
      createdAt: '2025-05-09T10:02:58.057Z',
      updatedAt: '2025-05-09T10:02:58.862Z'
    }
  ]
};

describe('orderCreationSlice reducer', () => {
  it('возвращает начальное состояние по умолчанию', () => {
    const state = orderCreationSlice.reducer(undefined, { type: '' });
    expect(state).toEqual(initialState);
  });

  it('обрабатывает sendOrder.pending', () => {
    const action = { type: sendOrder.pending.type };
    const state = orderCreationSlice.reducer(initialState, action);

    expect(state.loading).toBe(true); // загрузка включается
    expect(state.order).toBeNull(); // текущий заказ сбрасывается
    expect(state.error).toBeNull(); // ошибка очищается
  });

  it('обрабатывает sendOrder.fulfilled', () => {
    const action = {
      type: sendOrder.fulfilled.type,
      payload: { order: mockOrder }
    };
    const state = orderCreationSlice.reducer(initialState, action);

    expect(state.loading).toBe(false); // загрузка выключается
    expect(state.order).toEqual(mockOrder); // заказ сохраняется
    expect(state.error).toBeNull(); // ошибка отсутствует
  });

  it('обрабатывает sendOrder.rejected', () => {
    const action = { type: sendOrder.rejected.type };
    const state = orderCreationSlice.reducer(initialState, action);

    expect(state.loading).toBe(false); // загрузка выключается
    expect(state.error).toBe('Ошибка'); // ошибка устанавливается вручную
  });

  it('обрабатывает getOrderNumber.pending', () => {
    const action = { type: getOrderNumber.pending.type };
    const state = orderCreationSlice.reducer(initialState, action);

    expect(state.loading).toBe(true); // включается загрузка
    expect(state.error).toBeNull(); // ошибка очищается
  });

  it('обрабатывает getOrderNumber.fulfilled', () => {
    const action = {
      type: getOrderNumber.fulfilled.type,
      payload: mockOrderNumber
    };
    const state = orderCreationSlice.reducer(initialState, action);

    expect(state.loading).toBe(false); // выключается загрузка
    expect(state.orderNumber).toEqual(mockOrderNumber.orders[0]); // сохраняется заказ по номеру
    expect(state.error).toBeNull(); // ошибка очищается
  });

  it('обрабатывает getOrderNumber.rejected', () => {
    const action = { type: getOrderNumber.rejected.type };
    const state = orderCreationSlice.reducer(initialState, action);

    expect(state.loading).toBe(false); // выключается загрузка
    expect(state.order).toBeNull(); // текущий заказ сбрасывается
    expect(state.error).toBe('Ошибка'); // ошибка устанавливается вручную
  });
});
