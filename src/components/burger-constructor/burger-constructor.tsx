import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  orderPost,
  selectOrderDetails,
  selectOrderRequest,
  clearOrderDetails,
  clearConstructor,
  selectUserData
} from '@slices';
import { useDispatch, useSelector } from '../../services/hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  selectConstructorMemo,
  burgerCompositionMemo,
  ConstructorState,
  BurgerComposition
} from '../../services/slices/burgerConstructorSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const constructorState = useSelector(
    selectConstructorMemo
  ) as ConstructorState;
  const isOrderLoading = useSelector(selectOrderRequest);
  const orderInfo = useSelector(selectOrderDetails);
  const burgerData = useSelector(burgerCompositionMemo) as BurgerComposition;
  const userIsAuth = useSelector(selectUserData);

  const handleOrder = () => {
    if (!userIsAuth) {
      navigate('/login', { state: { from: location } });
      return;
    }
    if (!constructorState.bun || isOrderLoading) {
      console.error('Булка не выбрана');
      return;
    }
    if (constructorState.ingredients.length === 0) {
      console.error('Добавьте ингредиенты');
      return;
    }
    burgerData &&
      dispatch(orderPost(burgerData)).finally(() => {
        dispatch(clearConstructor());
      });
  };

  const handleCloseModal = () => {
    if (!isOrderLoading) {
      dispatch(clearOrderDetails());
    }
  };

  const totalPrice = useMemo(() => {
    const bunPrice = constructorState.bun ? constructorState.bun.price * 2 : 0;
    const ingredientsSum = constructorState.ingredients.reduce(
      (sum: number, item: TConstructorIngredient) => sum + item.price,
      0
    );
    return bunPrice + ingredientsSum;
  }, [constructorState]);

  return (
    <BurgerConstructorUI
      price={totalPrice}
      orderRequest={isOrderLoading}
      constructorItems={constructorState}
      orderModalData={orderInfo}
      onOrderClick={handleOrder}
      closeOrderModal={handleCloseModal}
    />
  );
};
