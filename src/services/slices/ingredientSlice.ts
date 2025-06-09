import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';

// Состояние ингредиентов
interface IIngredientsSlice {
  isLoading: boolean;
  ingredients: TIngredient[];
  error: string | undefined;
}

// Начальное состояние ингредиентов
export const initialState: IIngredientsSlice = {
  isLoading: true,
  ingredients: [],
  error: undefined
};

// Асинхронный thunk для получения списка ингредиентов
export const getIngredients = createAsyncThunk(
  'ingridients/getAll',
  async () => {
    const res = await getIngredientsApi();
    return res;
  }
);

/**
 * Слайс для управления состоянием ингредиентов
 * Содержит редьюсеры и селекторы для работы с ингредиентами
 */
export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Начало загрузки ингредиентов
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
      })
      // Ошибка при загрузке ингредиентов
      .addCase(getIngredients.rejected, (state, action) => {
        state.isLoading = true;
        state.error = action.error.message;
      })
      // Успешная загрузка ингредиентов
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      });
  },
  selectors: {
    // Селектор для получения списка ингредиентов
    ingredientsSelector: (state) => state.ingredients,
    // Селектор для получения статуса загрузки
    isLoadingSelectors: (state) => state.isLoading,
    // Селектор для получения ингредиента по ID
    selectIngredientById: (state, id: string) =>
      state.ingredients.find((ingredient) => ingredient._id == id)
  }
});

export const { ingredientsSelector, isLoadingSelectors, selectIngredientById } =
  ingredientsSlice.selectors;
