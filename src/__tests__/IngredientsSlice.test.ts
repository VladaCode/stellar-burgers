import ingredientsSlice, {
  fetchIngredients,
  initialState
} from '../services/slices/IngredientsSlice';

//Мок ингридиетов
const mockIngredients = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0942',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
  }
];

describe('ingredientsSlice reducer', () => {
  it('Получение исходного состояния', () => {
    // Проверка, что редьюсер возвращает начальное состояние,
    // если ему передано undefined и пустое действие
    const state = ingredientsSlice.reducer(undefined, { type: '' });
    expect(state).toEqual(initialState); // сравнение с initialState
  });
  // Тест проверяет, что в момент запроса (pending) loading = true, error = null
  it('обрабатывает fetchIngredients.pending ', () => {
    const action = { type: fetchIngredients.pending.type }; // Создаём экшен с типом pending (отправка запроса на сервер)
    const state = ingredientsSlice.reducer(initialState, action); //  берёт текущее состояние (initialState) и применяет к нему экшен pending, чтобы получить новое состояние.

    expect(state.loading).toBe(true); // включается индикатор загрузки
    expect(state.error).toBeNull(); // ошибка сбрасывается
  });

  // Тест проверяет, что при успешной загрузке (fulfilled)
  // данные сохраняются в store, и loading = false
  it('обрабатывает fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type, //это тип экшена, означающий успешную загрузку данных (fulfilled).
      payload: mockIngredients
    };

    const state = ingredientsSlice.reducer(initialState, action); //  берёт текущее состояние (initialState) и применяет к нему экшен fulfilled, чтобы получить новое состояние.

    expect(state.loading).toBe(false); //загрузка завершается
    expect(state.ingredients).toEqual(mockIngredients); //сохранются ингридиенты
  });

  // Тест проверяет, что при ошибке загрузки (rejected)
  // loading = false и ошибка сохраняется в store
  it('обрабатывает fetchIngredients.rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type, //это тип экшена, означающий ошибку при запросе (rejected).
      error: { message: 'Ошибка загрузки' } //имитируем тест ошибки
    };

    const state = ingredientsSlice.reducer(initialState, action); ///  берёт текущее состояние (initialState) и применяет к нему экшен rejected, чтобы получить новое состояние.

    expect(state.loading).toBe(false); // згрузка завершается

    expect(state.error).toBe('Ошибка загрузки'); // сохраняется ошибка
  });
});
