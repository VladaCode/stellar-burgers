import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';

// Тип состояния
type TUserState = {
  user: TUser | null; // объект с данными пользователя
  isAuthChecked: boolean; // Проверен ли статус авторизации
  error: null | string | undefined; // Сообщение об ошибке
};

// Начальное состояние
const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  error: null
};

/**
 * Асинхронный thunk для авторизации пользователя.
 * При успешной авторизации сохраняются токены, а затем возвращаются данные пользователя.
 */
export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);
      if (!response.success) {
        return rejectWithValue(response);
      }
      setCookie('accessToken', response.accessToken); // Сохраняем токены
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user; // Возвращаем обновленные данные пользователя
    } catch (err) {
      return rejectWithValue('Неверный email или пароль');
    }
  }
);
/**
 * Асинхронный thunk для регистрации нового пользователя.
 * После успешной регистрации сохраняются токены, а потом возвращаются данные нового пользователя.
 */
export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(data);
      if (!response.success) {
        return rejectWithValue(response);
      }
      setCookie('accessToken', response.accessToken); // Сохраняем токены
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user; // Возвращаем обновленные данные пользователя
    } catch (err) {
      return rejectWithValue('Ошибка регистрации');
    }
  }
);
// Асинхронный thunk для обновления профиля пользователя
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(data);
      if (!response.success) {
        return rejectWithValue(response);
      }
      return response.user; // Возвращаем обновленные данные пользователя
    } catch (err) {
      return rejectWithValue('Ошибка обновления профиля');
    }
  }
);

// Асинхронный thunk для выхода из аккаунта
export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await logoutApi();
      deleteCookie('accessToken'); // удаляем токен
      localStorage.clear(); // очищаем хранилище
      return response;
    } catch (err) {
      return rejectWithValue('Ошибка выполнения выхода');
    }
  }
);
/**
 * Асинхронный thunk для проверки статуса авторизации пользователя.
 * Если accessToken присутствует, запрашивает данные пользователя и диспатчит setUser.
 * В любом случае по завершении диспатчит setIsAuthChecked(true).
 */
export const checkUserAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      // Если есть accessToken в cookies, значит, пользователь мог быть авторизован
      getUserApi() // Пытаемся получить данные пользователя с сервера
        .then((res) => dispatch(setUser(res.user))) // Если данные получены, обновляем состояние с помощью setUser
        .finally(() => dispatch(setIsAuthChecked(true))); // После получения данных или ошибки отмечаем, что проверка авторизации завершена
    } else {
      dispatch(setIsAuthChecked(true)); // Если токена нет, сразу указываем, что проверка авторизации завершена
    }
  }
);
// Слайс профиля пользователя
export const userProfileSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /**
     * setIsAuthChecked устанавливает булевый флаг isAuthChecked.
     * Позволяет отметить, что проверка авторизации (например, в checkUserAuth)
     * завершилась.
     */ setIsAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    setUser: (state, action) => {
      //setUser обновляет объект user в состоянии.
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // --- loginUser ---
      .addCase(loginUser.pending, (state) => {
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // --- registerUser ---
      .addCase(registerUser.pending, (state) => {
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // --- updateUser ---
      .addCase(updateUser.pending, (state) => {
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // --- logoutUser ---
      .addCase(logoutUser.pending, (state) => {
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
  // Селекторы
  selectors: {
    getUserSelector: (state) => state.user, // получить пользователя
    getErrorSelector: (state) => state.error, // получить сообщение об ошибке
    getIsAuthCheckedSelector: (state) => state.isAuthChecked // проверить, был ли выполнен запрос
  }
});

export const userSliceReducer = userProfileSlice.reducer;
export const { setIsAuthChecked, setUser } = userProfileSlice.actions;
export default userProfileSlice;
export const { getUserSelector, getErrorSelector, getIsAuthCheckedSelector } =
  userProfileSlice.selectors;
