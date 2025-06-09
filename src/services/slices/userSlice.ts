import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';

const clearToken = () => {
  localStorage.clear();
  deleteCookie('accessToken');
};

export const getUser = createAsyncThunk('user/getUser', getUserApi);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  logoutApi().finally(() => {
    clearToken();
  });
});

// Проверка авторизации
export const checkUser = createAsyncThunk(
  'user/checkUser',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      dispatch(getUser()).finally(() => {
        dispatch(authCheck());
      });
    } else {
      dispatch(authCheck());
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password }: TLoginData) => {
    const res = await loginUserApi({ email, password });
    if (res.success) {
      setCookie('accessToken', res.accessToken, { SameSite: 'Strict' });
      localStorage.setItem('refreshToken', res.refreshToken);
      return res.user;
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async ({ email, name, password }: TRegisterData) =>
    await registerUserApi({ email, name, password }).catch(() => clearToken())
);

// Обновление данных
export const updateUser = createAsyncThunk(
  'user/update',
  async ({ email, name, password }: TRegisterData) => {
    const data = await updateUserApi({ email, name, password });
    if (!data.success) {
      return;
    } else {
      return data.user;
    }
  }
);

// Состояние пользователя
interface IUserState {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  user: TUser | undefined;
  error: string | undefined;
}

export const initialState: IUserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  user: undefined,
  error: ''
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Проверка авторизации
    authCheck: (state) => {
      state.isAuthChecked = true;
    },
    // Очистка ошибок
    clearErrors: (state) => {
      state.error = '';
    }
  },
  selectors: {
    selectUserAuthenticated: (state) => state.isAuthenticated,
    selectUserData: (state) => state.user,
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectUserError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      // Начало получения данных
      .addCase(getUser.pending, (state) => {
        Object.assign(state, initialState);
      })
      // Успешное получение
      .addCase(getUser.fulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.isAuthenticated = true;
        state.error = '';
      })
      // Ошибка получения
      .addCase(getUser.rejected, (state, action) => {
        state.error = action.error.message;
        state.user = undefined;
        state.isAuthenticated = false;
      })
      // Начало входа
      .addCase(loginUser.pending, (state) => {
        state.error = '';
      })
      // Ошибка входа
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Успешный вход
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = '';
      })
      // Успешный выход
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = undefined;
        state.isAuthChecked = true;
        state.isAuthenticated = false;
      })
      // Ошибка выхода
      .addCase(logoutUser.rejected, (state, { error }) => {
        state.error = error.message;
      })
      // Ошибка регистрации
      .addCase(registerUser.rejected, (state, { error }) => {
        state.error = error.message;
        state.user = undefined;
      })
      // Ошибка обновления
      .addCase(updateUser.rejected, (state, { error }) => {
        state.error = error.message;
      })
      // Успешное обновление
      .addCase(updateUser.fulfilled, (state, { payload }) => {
        state.user = payload;
      });
  }
});

export default userSlice.reducer;
export const {
  selectUserAuthenticated,
  selectUserData,
  selectIsAuthChecked,
  selectUserError
} = userSlice.selectors;
export const { authCheck, clearErrors } = userSlice.actions;
