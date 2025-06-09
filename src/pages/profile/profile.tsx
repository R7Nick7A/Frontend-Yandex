import { FC, SyntheticEvent, useEffect, useState, Dispatch } from 'react';

import { ProfileUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/hooks';
import { selectUserData, updateUser } from '@slices';
import { Navigate } from 'react-router-dom';
import { useForm } from '../../services/hooks';
interface IProfileForm {
  name: string;
  email: string;
  password: string;
}
export const Profile: FC = () => {
  // ### Профиль
  const dispatch = useDispatch();
  const user = useSelector(selectUserData);

  if (!user) {
    return <Navigate to='/login' />;
  }

  const { formValue, handleChange, setFormValue } = useForm<IProfileForm>({
    name: user.name,
    email: user.email,
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    // note: обновление пользователя (с сервера не приходит ошибка)
    isFormChanged && dispatch(updateUser(formValue));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user.name,
      email: user.email,
      password: ''
    });
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleChange}
    />
  );
};
