import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  ingredientsSlice,
  burgerConstructorSlice,
  userSlice,
  feedSlice,
  orderSlice,
  orderBurgerSlice
} from '@slices';

// Объединение всех редьюсеров
export const RootReducer = combineReducers({
  [burgerConstructorSlice.name]: burgerConstructorSlice.reducer,
  [feedSlice.name]: feedSlice.reducer,
  [ingredientsSlice.name]: ingredientsSlice.reducer,
  [userSlice.name]: userSlice.reducer,
  [orderSlice.name]: orderSlice.reducer,
  [orderBurgerSlice.name]: orderBurgerSlice.reducer
});

// Создание хранилища
const store = configureStore({
  reducer: RootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

// Типы для TypeScript
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof RootReducer>;

export default store;
