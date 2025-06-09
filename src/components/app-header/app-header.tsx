import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/hooks';
import { selectUserData } from '@slices';

export const AppHeader: FC = () => {
  const user = useSelector(selectUserData);
  return <AppHeaderUI userName={user?.name} />;
};
