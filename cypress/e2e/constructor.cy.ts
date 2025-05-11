// <reference types="cypress" />
// cypress/plugins/index.js

// Основной блок с описанием набора тестов
describe('Тесты для конструктора бургера', () => {
  // Селекторы элементов интерфейса
  const constructor = '[data-cy="constructor-test"]';
  const ingredient = '[data-cy="ingredient-item"]';
  const modal = '[data-cy="modal"]';
  const closeModal = '[data-cy="modal-close"]';
  const closeModelOverlay = '[data-cy = "modal-overlay-close"]';
  const orderButton = '[data-cy="order-button"]';

  // Хук, который выполняется перед каждым тестом
  beforeEach(() => {
    // Перехватываем HTTP-запрос на получение ингредиентов и возвращаем заранее заданный JSON-файл
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });

    // Перехватываем HTTP-запрос на получение данных пользователя и возвращаем фикстуру login
    cy.intercept('GET', 'api/auth/user', { fixture: 'login.json' });

    // Перехватываем HTTP-запрос на создание заказа и возвращаем фикстуру с фейковым номером заказа
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' });

    // Устанавливаем токены авторизации в localStorage и куки
    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('fakeRefreshToken') // Сохраняем фейковый refreshToken в localStorage
    );

    cy.setCookie('accessToken', 'fakeAccessToken'); // Устанавливаем фейковый accessToken в cookie

    cy.viewport(1300, 800);

    // Открываем главную страницу приложения
    cy.visit('/');
  });

  // Хук, который выполняется после каждого теста
  afterEach(() => {
    // Очищаем localStorage и cookies, чтобы избежать влияния на следующие тесты
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  // Тест: проверка добавления ингредиентов в конструктор
  describe('Добавление ингредиентов в конструктор', () => {
    it('Проверка добавления ингредиента из списка в конструктор', () => {
      // Находим и добавляем булку
      cy.contains(ingredient, 'Краторная булка N-200i').find('button').click();

      // Находим и добавляем котлету
      cy.contains(ingredient, 'Биокотлета из марсианской Магнолии').find('button').click();

      // Находим и добавляем котлету
      cy.contains(ingredient, 'Соус Spicy-X').find('button').click();

      // Проверяем, что все ингридиенты отображаются в конструкторе
      cy.get(constructor)
        .should('contain', 'Краторная булка N-200i')
        .and('contain', 'Биокотлета из марсианской Магнолии')
        .and('contain', 'Соус Spicy-X');
    });
  });

  // Тест: проверка открытия и закрытия модального окна ингредиента
  describe('Тесты для модальных окон', () => {
    beforeEach(() => {
      //Окрываем модальное окно перед каждыйм тетом на закрытие
      cy.get(ingredient).contains('Краторная булка N-200i').click();

      //Проверяем, что модалка открытка
      cy.get(modal).should('be.visible');
    });

    it('Проверка открытия модального окна с описанием ингредиента', () => {
      // Проверяем, что модалка содержит правильную информацию
      cy.get(modal).should('contain', 'Краторная булка N-200i');
    });

    it('Проверка закрытие модального окна через крестик', () => {
      //Закрываем модалку через кнопку
      cy.get(closeModal).click();

      //проверка что модалка закрыта
      cy.get(modal).should('not.exist');
    });

    it('Проверка открытие модального окна через оверлей', () => {
      //закрываем модалку по оверлею
      cy.get(closeModelOverlay).click({ force: true });

      //Проверка что модалка закрыта
      cy.get(modal).should('not.exist');
    });
  });

  // Секция 3: Тесты для оформления заказа
  describe('Оформление заказа', () => {
    it('Проверка создания заказа', () => {
      // Добавляем ингредиенты в бургер
      // Находим и добавляем булку
      cy.contains(ingredient, 'Краторная булка N-200i').find('button').click();

      // Находим и добавляем котлету
      cy.contains(ingredient, 'Биокотлета из марсианской Магнолии').find('button').click();

      // Находим и добавляем котлету
      cy.contains(ingredient, 'Соус Spicy-X').find('button').click();

      // Кликаем на кнопку "Оформить заказ"
      cy.get(orderButton).click();

      // Проверяем, что появляется модальное окно с номером заказа
      cy.get(modal).should('be.visible').and('contain', '12345');

      // Закрываем модалку
      cy.get(closeModal).click();

      // Убеждаемся, что модалка исчезла
      cy.get(modal).should('not.exist');

      // Проверяем, что конструктор очищен от ингредиентов после оформления заказа
      cy.get(constructor)
        .should('not.contain', 'Краторная булка N-200i')
        .and('not.contain', 'Биокотлета из марсианской Магнолии')
        .and('not.contain', 'Соус Spicy-X');
    });
  });
});
