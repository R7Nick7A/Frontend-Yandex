import { useState, useRef, useEffect, FC, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSelector } from '../../services/hooks';
import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '@ui';
import { ingredientsSelector } from '@slices';

export const BurgerIngredients: FC = () => {
  const ingredients = useSelector(ingredientsSelector);

  const buns = useMemo(
    () => ingredients.filter((item) => item.type === 'bun'),
    [ingredients]
  );
  const mains = useMemo(
    () => ingredients.filter((item) => item.type === 'main'),
    [ingredients]
  );
  const sauces = useMemo(
    () => ingredients.filter((item) => item.type === 'sauce'),
    [ingredients]
  );

  const [activeTab, setActiveTab] = useState<TTabMode>('bun');
  const bunTitleRef = useRef<HTMLHeadingElement>(null);
  const mainTitleRef = useRef<HTMLHeadingElement>(null);
  const sauceTitleRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({ threshold: 0 });
  const [mainsRef, inViewFilling] = useInView({ threshold: 0 });
  const [saucesRef, inViewSauces] = useInView({ threshold: 0 });

  useEffect(() => {
    if (inViewBuns) {
      setActiveTab('bun');
    } else if (inViewSauces) {
      setActiveTab('sauce');
    } else if (inViewFilling) {
      setActiveTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = (tab: string) => {
    setActiveTab(tab as TTabMode);
    if (tab === 'bun') {
      bunTitleRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    if (tab === 'main') {
      mainTitleRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    if (tab === 'sauce') {
      sauceTitleRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <BurgerIngredientsUI
      currentTab={activeTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={bunTitleRef}
      titleMainRef={mainTitleRef}
      titleSaucesRef={sauceTitleRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
