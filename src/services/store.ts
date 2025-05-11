import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { ingredientsSliceReducer } from './slices/IngredientsSlice';
import { ingredientSliceReducer } from './slices/BurgerConstructorSlice';
import { orderSliceReducer } from './slices/OrderCreationSlice';
import { feedSliceReducer } from './slices/FeedSlice';
import { userSliceReducer } from './slices/UserProfileSlice';
import { profileOrdersReducer } from './slices/ProfileOrdersSlice';

// Комбинируем все слайсы в один корневой редьюсер
export const rootReducer = combineReducers({
  ingredients: ingredientsSliceReducer,
  burgerConstructor: ingredientSliceReducer,
  order: orderSliceReducer,
  feed: feedSliceReducer,
  user: userSliceReducer,
  profileOrders: profileOrdersReducer
});

//создания хранилища
const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>; // тип, представляющий всё состояние приложения

export type AppDispatch = typeof store.dispatch; // тип для dispatch-метода хранилища

//Типизация хуков
export const useDispatch: () => AppDispatch = () => dispatchHook(); // возвращает типизированный dispatch
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
