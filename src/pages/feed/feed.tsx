import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/hooks';
import { getFeeds, selectFeedOrders } from '@slices';

export const Feed: FC = () => {
  //###  Лента заказов
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getFeeds());
  }, []);
  const orders: TOrder[] = useSelector(selectFeedOrders);

  if (!orders.length) {
    return <Preloader />;
  }
  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(getFeeds());
      }}
    />
  );
};
