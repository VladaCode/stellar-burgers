import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
// Импорт селектора для получения ингредиентов из стор
import { getIngredientsWithSelector } from '../../services/slices/IngredientsSlice';
import styles from '../app/app.module.css';

export const IngredientDetails: FC = () => {
  // Получаем id ингредиента из параметров URL
  const { id } = useParams<{ id: string }>();

  // Получаем список ингредиентов из стор
  const ingredients = useSelector(getIngredientsWithSelector);

  // Ищем нужный ингредиент по id
  const ingredientData = ingredients.find((item) => item._id === id);

  // Если ингредиент ещё не найден (например, данные ещё загружаются) — показываем прелоадер
  if (!ingredientData) {
    return <Preloader />;
  }

  // Когда ингредиент найден — отображаем детальный UI
  return (
    <div className={styles.detailPageWrap}>
      <IngredientDetailsUI ingredientData={ingredientData} />
    </div>
  );
};
