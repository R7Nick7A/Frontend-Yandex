import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { IngredientDetailsUI, Preloader } from '@ui';
import { selectIngredientById } from '@slices';
import { RootState } from '../../services/store';
import { useSelector } from '../../services/hooks';

export const IngredientDetails: FC = () => {
  const { id } = useParams();

  const ingredientData = id
    ? useSelector((state: RootState) => selectIngredientById(state, id))
    : null;

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
