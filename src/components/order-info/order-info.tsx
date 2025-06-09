import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/hooks';
import {
  getOrderByNumber,
  ingredientsSelector,
  selectOpeningOrder
} from '@slices';
import { useParams } from 'react-router-dom';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams();

  useEffect(() => {
    number && dispatch(getOrderByNumber(number));
  }, [number]);

  const ingredients: TIngredient[] = useSelector(ingredientsSelector);
  const orderData = useSelector(selectOpeningOrder);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc, item) => {
        if (!acc[item]) {
          const foundIngredient = ingredients.find((ing) => ing._id === item);
          if (foundIngredient) {
            acc[item] = {
              ...foundIngredient,
              count: 1
            };
          }
        } else {
          acc[item].count += 1;
        }
        return acc;
      },
      {} as { [key: string]: TIngredient & { count: number } }
    );

    const total = Object.values(ingredientsInfo).reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }
  return <OrderInfoUI orderInfo={orderInfo} />;
};
