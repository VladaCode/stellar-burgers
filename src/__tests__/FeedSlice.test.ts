import  feedSlice, {
  initialState,
  getFeeds
} from '../services/slices/FeedSlice';

// Мок данных закзов
const mockOrders = {
  success: true,
  orders: [
    {
      _id: '681dd2d2c2f30c001cb22912',
      ingredients: ['643d69a5c3f7b9001cfa093c'],
      status: 'done',
      name: 'Краторный бургер',
      createdAt: '2025-05-09T10:02:58.057Z',
      updatedAt: '2025-05-09T10:02:58.862Z',
      number: 76648
    },
    {
      _id: '681dd2a7c2f30c001cb22911',
      ingredients: [
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa093e',
        '643d69a5c3f7b9001cfa0940',
        '643d69a5c3f7b9001cfa093f',
        '643d69a5c3f7b9001cfa0947'
      ],
      status: 'done',
      name: 'Фалленианский краторный бессмертный люминесцентный метеоритный бургер',
      createdAt: '2025-05-09T10:02:15.220Z',
      updatedAt: '2025-05-09T10:02:16.069Z',
      number: 76647
    },
    {
      _id: '681dcbcac2f30c001cb228ab',
      ingredients: [
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa093e',
        '643d69a5c3f7b9001cfa0943'
      ],
      status: 'done',
      name: 'Краторный space люминесцентный бургер',
      createdAt: '2025-05-09T09:32:58.670Z',
      updatedAt: '2025-05-09T09:32:59.699Z',
      number: 76646
    }
  ],
  total: 76274,
  totalToday: 82
};

describe('feedSlice reducer', () => {
  it('Получение исходного состояния', () => {
    // Проверка, что редьюсер возвращает начальное состояние,
    // если ему передано undefined и пустое действие
    const state = feedSlice.reducer(undefined, { type: '' });
    expect(state).toEqual(initialState); // сравнение с initialState
  });
  // Тест проверяет, что в момент запроса (pending) loading = true, error = null
  it('обрабатывает getFeeds.pending', () => {
    const action = { type: getFeeds.pending.type }; // Создаём экшен с типом pending (отправка запроса на сервер)
    const state = feedSlice.reducer(initialState, action); //  берёт текущее состояние (initialState) и применяет к нему экшен pending, чтобы получить новое состояние.

    expect(state.loading).toBe(true); // включается индикатор загрузки
    expect(state.error).toBeNull(); // ошибка сбрасывается
  });
  // Тест проверяет, что при успешной загрузке (fulfilled)
  // данные сохраняются в store, и loading = false
  it('обрабатывает getfeeds.fulfilled', () => {
    const action = {
      type: getFeeds.fulfilled.type, //это тип экшена, означающий успешную загрузку данных (fulfilled).
      payload: mockOrders
    };

    const state = feedSlice.reducer(initialState, action); //  берёт текущее состояние (initialState) и применяет к нему экшен fulfilled, чтобы получить новое состояние.

    expect(state.loading).toBe(false); //загрузка завершается
    expect(state.orders).toEqual(mockOrders.orders); // сохраняются заказа
    expect(state.total).toBe(mockOrders.total); //сохраняется общее количество заказа
    expect(state.totalToday).toBe(mockOrders.totalToday); // сохраняется количество заказов за сегодня
  });

  // Тест проверяет, что при ошибке загрузки (rejected)
  // loading = false и ошибка сохраняется в store
  it('обрабатывает getFeeds.rejected', () => {
    const action = {
      type: getFeeds.rejected.type, //это тип экшена, означающий ошибку при запросе (rejected).
      error: { message: 'Ошибка загрузки' } //имитируем тест ошибки
    };

    const state = feedSlice.reducer(initialState, action); //  берёт текущее состояние (initialState) и применяет к нему экшен rejected, чтобы получить новое состояние.

    expect(state.loading).toBe(false); //загрузка завершается
    expect(state.error).toBe('Ошибка загрузки'); //ошибка сохраняется
  });
});
