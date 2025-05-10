import { TIngredient } from '@utils-types';
import {
  burgerConstructorSlice,
  initialState
} from '../services/slices/BurgerConstructorSlice';

// Мок ингредиента 1
const mockIngredientA: TIngredient = {
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
};

// Мок ингредиента 2
const mockIngredientB: TIngredient = {
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
};

describe('burgerConstructorSlice reducer', () => {
  it('Получение исходного состояния', () => {
    // Проверка, что редьюсер возвращает начальное состояние,
    // если ему передано undefined и пустое действие
    const state = burgerConstructorSlice.reducer(undefined, { type: '' });
    expect(state).toEqual(initialState); // сравнение с initialState
  });

  it('добавляет ингредиент в конструктор', () => {
    // Создаем экшен на добавление mockIngredient1
    const action =
      burgerConstructorSlice.actions.addBurgerIngredient(mockIngredientA);

    // Вызываем редьюсер с начальным состоянием и этим экшеном
    const state = burgerConstructorSlice.reducer(initialState, action);

    // Ожидаем, что в массиве ингредиентов теперь один элемент
    expect(state.ingredients.length).toBe(1);

    // Проверяем, что этот элемент содержит те же свойства, что и исходный mockIngredient1
    expect(state.ingredients[0]).toMatchObject(mockIngredientA);

    // Проверяем, что был добавлен уникальный id
    expect(state.ingredients[0]).toHaveProperty('id');
  });

  it('удаляет ингредиент из конструктора по id', () => {
    // Сначала добавим ингредиент, чтобы потом удалить
    const action =
      burgerConstructorSlice.actions.addBurgerIngredient(mockIngredientA);
    const state = burgerConstructorSlice.reducer(initialState, action);

    // Получаем сгенерированный id у добавленного ингредиента
    const addedId = state.ingredients[0].id;

    // Создаем экшен на удаление по этому id
    const removeAction =
      burgerConstructorSlice.actions.removeBurgerIngredient(addedId);

    // Вызываем редьюсер — удаляем ингредиент
    const stateAfterRemove = burgerConstructorSlice.reducer(
      state,
      removeAction
    );

    // Проверяем, что массив ингредиентов теперь пуст
    expect(stateAfterRemove.ingredients.length).toBe(0);
  });

  it('меняет порядок ингредиентов: move up', () => {
    // Добавляем сначала первый ингредиент, потом второй
    const first =
      burgerConstructorSlice.actions.addBurgerIngredient(mockIngredientA);
    const second =
      burgerConstructorSlice.actions.addBurgerIngredient(mockIngredientB);

    // Применяем оба экшена, чтобы получить состояние с двумя ингредиентами
    let state = burgerConstructorSlice.reducer(initialState, first);
    state = burgerConstructorSlice.reducer(state, second);

    // Получаем id второго ингредиента
    const idToMove = state.ingredients[1].id;

    // Создаем экшен на перемещение вверх
    const moveUpAction =
      burgerConstructorSlice.actions.moveUpIngredient(idToMove);

    // Применяем его
    const newState = burgerConstructorSlice.reducer(state, moveUpAction);

    // Ожидаем, что второй ингредиент оказался на первой позиции
    expect(newState.ingredients[0].id).toBe(idToMove);
  });

  it('меняет порядок ингредиентов: move down', () => {
    // Аналогично: сначала добавим два ингредиента
    const first =
      burgerConstructorSlice.actions.addBurgerIngredient(mockIngredientA);
    const second =
      burgerConstructorSlice.actions.addBurgerIngredient(mockIngredientB);

    let state = burgerConstructorSlice.reducer(initialState, first);
    state = burgerConstructorSlice.reducer(state, second);

    // Берем id первого ингредиента (на позиции 0)
    const idToMove = state.ingredients[0].id;

    // Создаем экшен на перемещение вниз
    const moveDownAction =
      burgerConstructorSlice.actions.moveDownIngredient(idToMove);

    // Применяем редьюсер
    const newState = burgerConstructorSlice.reducer(state, moveDownAction);

    // Проверяем, что он теперь на второй позиции (индекс 1)
    expect(newState.ingredients[1].id).toBe(idToMove);
  });
});
