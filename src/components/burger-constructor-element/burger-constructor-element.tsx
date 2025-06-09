import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/hooks';
import { removeIngredientById, moveItem } from '@slices';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    // Переместить элемент вниз
    const moveDown = () => {
      dispatch(moveItem({ indexFrom: index, indexTo: 1 }));
    };

    // Переместить элемент вверх
    const moveUp = () => {
      dispatch(moveItem({ indexFrom: index, indexTo: -1 }));
    };

    // Удалить ингредиент
    const removeIngredient = () => {
      dispatch(removeIngredientById(ingredient.id));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={moveUp}
        handleMoveDown={moveDown}
        handleClose={removeIngredient}
      />
    );
  }
);
