import { useSelector } from '../../services/store';

import styles from './constructor-page.module.css';

import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC } from 'react';

export const ConstructorPage: FC = () => {
  const isIngredientsLoading = false; // Флаг загрузки ингредиентов

  return (
    <>
      {/* Пока данные загружаются — показываем прелоадер */}
      {isIngredientsLoading ? (
        <Preloader />
      ) : (
        // Когда данные загружены — отображаем основное содержимое страницы
        <main className={styles.containerMain}>
          {/* Заголовок страницы */}
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          {/* Основной контейнер с ингредиентами и конструктором */}
          <div className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients />
            {/* Компонент со списком доступных ингредиентов */}
            <BurgerConstructor />
            {/* Компонент, где пользователь собирает бургер */}
          </div>
        </main>
      )}
    </>
  );
};
