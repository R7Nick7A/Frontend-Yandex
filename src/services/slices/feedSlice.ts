import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeedsApi } from '@api';

// Получение заказов
export const getFeeds = createAsyncThunk('feed/getFeed', async () => {
  const res = getFeedsApi();
  return res;
});

// Состояние ленты
interface IFeedState {
  orders: TOrder[]; // Список заказов
  total: number; // Общее количество
  totalToday: number; // За сегодня
  isLoading: boolean; // Статус загрузки
  error: string | undefined; // Ошибка
}

// Начальное состояние
export const initialState: IFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: true,
  error: undefined
};

// Слайс ленты
export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Начало загрузки
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
        state.orders = [];
        state.total = 0;
        state.totalToday = 0;
      })
      // Успешная загрузка
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = undefined;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      // Обработка и сохранение ошибки
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = true;
        state.error = action.error.message;
      });
  },
  selectors: {
    // Состояние ленты
    selectFeedState: (state) => state,
    // Список заказов
    selectFeedOrders: (state) => state.orders
  }
});

export const { selectFeedState, selectFeedOrders } = feedSlice.selectors;
