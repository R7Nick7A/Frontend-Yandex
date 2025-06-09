import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrderByNumberApi, getOrdersApi } from '@api';

export const getOrders = createAsyncThunk('orders/get', getOrdersApi);

export const getOrderByNumber = createAsyncThunk(
  'orders/getOrderById',
  async (id: number | string) => {
    let number: number;
    if (typeof id === 'string') number = Number(id);
    else number = id;
    const res = await getOrderByNumberApi(number);
    return res.orders[0];
  }
);

interface IOrderState {
  orders: TOrder[]; // Список заказов
  currentOrder: TOrder | null; // Активный заказ
  error: string | undefined; // Сообщение об ошибке
}

// Начальное состояние - пустой список заказов
export const initialState: IOrderState = {
  orders: [],
  currentOrder: null,
  error: undefined
};

// Управление заказами
export const orderSlice = createSlice({
  name: 'orderSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Загрузка заказа
      .addCase(getOrderByNumber.pending, (state) => {
        state.error = undefined;
        state.currentOrder = null;
      })
      // Заказ успешно загружен
      .addCase(getOrderByNumber.fulfilled, (state, { payload }) => {
        state.error = undefined;
        state.currentOrder = payload;
      })
      // Ошибка при загрузке заказа
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.error = action.error.message;
        state.currentOrder = null;
      })
      // Загрузка списка
      .addCase(getOrders.pending, (state) => {
        state.error = undefined;
      })
      // Список заказов загружен
      .addCase(getOrders.fulfilled, (state, action) => {
        state.error = undefined;
        state.orders = action.payload;
      })
      // Ошибка при загрузке списка
      .addCase(getOrders.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
  selectors: {
    // Получение списка заказов пользователя
    selectProfileOrders: (state) => state.orders,
    // Получение текущего заказа
    selectOpeningOrder: (state) => state.currentOrder
  }
});

export const { selectProfileOrders, selectOpeningOrder } = orderSlice.selectors;
