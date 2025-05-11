import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';

import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useSelector } from '../../services/store';

import { Preloader } from '../../components/ui';
import {
  getIngredientsWithSelector,
  getLoadingSelector
} from '../../services/slices/IngredientsSlice';

//компонент-обертка для описания логики отображения списка ингридиентов
export const BurgerIngredients: FC = () => {
  // Получаем данные из Redux стора
  const ingredients = useSelector(getIngredientsWithSelector); // список всех ингредиентов
  const isLoading = useSelector(getLoadingSelector); // статус загрузки

  // Фильтруем ингредиенты по их типу
  const buns = ingredients.filter((item) => item.type === 'bun'); // булки
  const mains = ingredients.filter((item) => item.type === 'main'); // основные
  const sauces = ingredients.filter((item) => item.type === 'sauce'); // соус

  // Текущая активная вкладка
  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');

  // Ссылки на заголовки секций
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  // Отслеживаем, находятся ли секции в области видимости
  const [bunsRef, inViewBuns] = useInView({
    threshold: 0
  });

  const [mainsRef, inViewFilling] = useInView({
    threshold: 0
  });

  const [saucesRef, inViewSauces] = useInView({
    threshold: 0
  });

  // Эффект для изменения активной вкладки при прокрутке
  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  // Обработка клика по вкладке: устанавливаем текущую и скроллим к нужной секции
  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Если данные ещё загружаются — показываем прелоадер
  if (isLoading) {
    return <Preloader />;
  }

  // Рендерим UI-компонент с нужными пропсами
  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
