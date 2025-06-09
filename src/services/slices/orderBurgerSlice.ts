import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { orderBurgerApi } from '@api';

// Выполнение запроса к API и обновление состояния
export const orderPost = createAsyncThunk('orderBurger/Post', orderBurgerApi);

// Интерфейс состояния заказа
interface IOrderSlice {
  order: TOrder | null;
  error: string | undefined;
  orderRequest: boolean;
}

// Начальное состояние заказа
export const initialState: IOrderSlice = {
  order: null,
  error: undefined,
  orderRequest: false
};

// Слайс для управления состоянием заказа
export const orderBurgerSlice = createSlice({
  name: 'orderBurger',
  initialState,
  reducers: {
    clearOrderDetails: () => initialState
  },
  extraReducers: (builder) => {
    builder
      // Начало создания заказа (сбрасывает ошибки и устанавливает флаг запроса)
      .addCase(orderPost.pending, (state) => {
        state.error = undefined;
        state.orderRequest = true;
      })
      // Обработка успешного создания заказа (cохраняет данные заказа и флаг запроса)
      .addCase(orderPost.fulfilled, (state, action) => {
        state.error = undefined;
        state.order = action.payload.order;
        state.orderRequest = false;
      })
      // Обработка ошибки при создании заказа (сохраняет сообщение об ошибке и сбрасывает флаг запроса)
      .addCase(orderPost.rejected, (state, action) => {
        state.error = action.error.message;
        state.orderRequest = false;
      });
  },
  selectors: {
    // Селектор для получения деталей заказа
    selectOrderDetails: (state) => state.order,
    // Селектор для получения статуса запроса
    selectOrderRequest: (state) => state.orderRequest
  }
});

export const { selectOrderRequest, selectOrderDetails } =
  orderBurgerSlice.selectors;
export const { clearOrderDetails } = orderBurgerSlice.actions;
