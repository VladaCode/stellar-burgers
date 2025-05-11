import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useState } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  getUserSelector,
  updateUser
} from '../../services/slices/UserProfileSlice';

export const Profile: FC = () => {
  const user = useSelector(getUserSelector); // Получаем текущего пользователя из Redux
  const dispatch = useDispatch();

  // Локальное состояние формы, инициализируем его значениями пользователя
  const [formValue, setFormValue] = useState({
    name: user?.name || '', // если name нет — подставим пустую строку, чтобы избежать ошибок типов
    email: user?.email || '',
    password: '' // пароль изначально пустой
  });

  // Проверяем, были ли изменения в форме по сравнению с данными пользователя
  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password; // если ввели пароль — тоже считаем, что форма изменилась

  // Отправка формы (обновление данных пользователя)
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      updateUser({
        name: formValue.name,
        email: formValue.email,
        password: formValue.password
      })
    );
  };

  // Отмена изменений — сбрасываем форму до текущих значений пользователя
  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: '' // пароль сбрасываем
    });
  };

  // Обновление полей формы при вводе
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value // обновляем нужное поле
    }));
  };

  return (
    <ProfileUI
      formValue={formValue} // передаём значения формы
      isFormChanged={isFormChanged} // передаём флаг, был ли изменён хотя бы один input
      handleCancel={handleCancel} // обработчик отмены
      handleSubmit={handleSubmit} // обработчик сохранения
      handleInputChange={handleInputChange} // обработчик изменений полей ввода
    />
  );
};
