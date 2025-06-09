import { getOrders, selectProfileOrders } from '@slices';
import { useDispatch, useSelector } from '../../services/hooks';
import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';

export const ProfileOrders: FC = () => {
  // ### История заказов

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOrders());
  }, []);

  const orders: TOrder[] = useSelector(selectProfileOrders);

  return <ProfileOrdersUI orders={orders} />;
};
