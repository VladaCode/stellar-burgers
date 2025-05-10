import userProfileSlice, {
  initialState,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
  setUser,
  setIsAuthChecked
} from '../services/slices/UserProfileSlice';
import { TUser } from '@utils-types';

const mockUser: TUser = {
  name: 'Владав',
  email: 'sagermanovavl@gmail.com'
};

describe('userProfileSlice reducer', () => {
  it('должен возвращать начальное состояние', () => {
    const state = userProfileSlice.reducer(undefined, { type: '' });
    expect(state).toEqual(initialState);
  });

  it('обрабатывает setUser', () => {
    const action = setUser(mockUser);
    const state = userProfileSlice.reducer(initialState, action);
    expect(state.user).toEqual(mockUser);
  });

  it('обрабатывает setIsAuthChecked', () => {
    const action = setIsAuthChecked(true);
    const state = userProfileSlice.reducer(initialState, action);
    expect(state.isAuthChecked).toBe(true);
  });

  describe('loginUser', () => {
    it('pending: очищает ошибку', () => {
      const action = { type: loginUser.pending.type };
      const state = userProfileSlice.reducer({ ...initialState, error: 'Ошибка' }, action);
      expect(state.error).toBeNull();
    });

    it('fulfilled: устанавливает пользователя и флаг isAuthChecked', () => {
      const action = { type: loginUser.fulfilled.type, payload: mockUser };
      const state = userProfileSlice.reducer(initialState, action);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
      expect(state.error).toBeNull();
    });

    it('rejected: сохраняет ошибку', () => {
      const action = { type: loginUser.rejected.type, payload: 'Неверный email или пароль' };
      const state = userProfileSlice.reducer(initialState, action);
      expect(state.error).toBe('Неверный email или пароль');
    });
  });

  describe('registerUser', () => {
    it('pending: очищает ошибку', () => {
      const action = { type: registerUser.pending.type };
      const state = userProfileSlice.reducer({ ...initialState, error: 'Ошибка' }, action);
      expect(state.error).toBeNull();
    });

    it('fulfilled: устанавливает пользователя и флаг isAuthChecked', () => {
      const action = { type: registerUser.fulfilled.type, payload: mockUser };
      const state = userProfileSlice.reducer(initialState, action);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
      expect(state.error).toBeNull();
    });

    it('rejected: сохраняет ошибку', () => {
      const action = { type: registerUser.rejected.type, payload: 'Ошибка регистрации' };
      const state = userProfileSlice.reducer(initialState, action);
      expect(state.error).toBe('Ошибка регистрации');
    });
  });

  describe('updateUser', () => {
    it('pending: очищает ошибку', () => {
      const action = { type: updateUser.pending.type };
      const state = userProfileSlice.reducer({ ...initialState, error: 'Ошибка' }, action);
      expect(state.error).toBeNull();
    });

    it('fulfilled: обновляет пользователя и флаг isAuthChecked', () => {
      const action = { type: updateUser.fulfilled.type, payload: mockUser };
      const state = userProfileSlice.reducer(initialState, action);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
      expect(state.error).toBeNull();
    });

    it('rejected: сохраняет ошибку', () => {
      const action = { type: updateUser.rejected.type, payload: 'Ошибка обновления профиля' };
      const state = userProfileSlice.reducer(initialState, action);
      expect(state.error).toBe('Ошибка обновления профиля');
    });
  });

  describe('logoutUser', () => {
    it('pending: очищает ошибку', () => {
      const action = { type: logoutUser.pending.type };
      const state = userProfileSlice.reducer({ ...initialState, error: 'Ошибка' }, action);
      expect(state.error).toBeNull();
    });

    it('fulfilled: очищает пользователя', () => {
      const action = { type: logoutUser.fulfilled.type };
      const state = userProfileSlice.reducer({ ...initialState, user: mockUser }, action);
      expect(state.user).toBeNull();
    });

    it('rejected: сохраняет ошибку', () => {
      const action = { type: logoutUser.rejected.type, payload: 'Ошибка выполнения выхода' };
      const state = userProfileSlice.reducer(initialState, action);
      expect(state.error).toBe('Ошибка выполнения выхода');
    });
  });
});
