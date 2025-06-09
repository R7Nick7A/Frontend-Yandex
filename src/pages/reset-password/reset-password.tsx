import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { resetPasswordApi } from '@api';
import { ResetPasswordUI } from '@ui-pages';
import { useForm } from '../../services/hooks';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();

  const { formValue, handleChange, setFormValue } = useForm<{
    password: string;
    token: string;
  }>({
    password: '',
    token: ''
  });
  const [error, setError] = useState<Error | null>(null);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);
    resetPasswordApi(formValue)
      .then(() => {
        localStorage.removeItem('resetPassword');
        navigate('/login');
      })
      .catch((err) => setError(err));
  };

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  return (
    <ResetPasswordUI
      errorText={error?.message}
      password={formValue.password}
      token={formValue.token}
      handleInputChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
