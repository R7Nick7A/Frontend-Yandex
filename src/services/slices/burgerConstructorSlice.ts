import {
  createSlice,
  nanoid,
  PayloadAction,
  createSelector
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { RootState } from '../store';

/**
 * Состояние конструктора
 * Содержит список ингредиентов и выбранную булочку
 */
export type TConstructorState = {
  ingredients: TConstructorIngredient[];
  bun: TConstructorIngredient | null;
};

/**
 * Начальное состояние
 * Пустой список ингредиентов и отсутствие булочки
 */
export const initialState: TConstructorState = {
  ingredients: [],
  bun: null
};

/**
 * Параметры перемещения
 * Содержит индексы исходной и целевой позиции
 */
type TMoveElement = { indexFrom: number; indexTo: 1 | -1 };

/**
 * Перемещение ингредиентов
 * @param arr - Массив ингредиентов
 * @param from - Индекс элемента для перемещения
 * @param to - Целевой индекс
 * @returns Новый массив с перемещенными элементами
 */
function swapIngredients(
  arr: TConstructorIngredient[],
  from: number,
  to: number
) {
  if (
    from >= 0 &&
    to >= 0 &&
    from < arr.length &&
    to < arr.length &&
    from !== to
  ) {
    const newArr = [...arr];
    const temp = newArr[from];
    newArr[from] = newArr[to];
    newArr[to] = temp;
    return newArr;
  }
  return arr;
}

/**
 * Слайс конструктора
 * Содержит редьюсеры и селекторы для работы с конструктором
 */
export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    /**
     * Добавление ингредиента
     * Если добавляется булочка, заменяет текущую булочку
     * Если добавляется другой ингредиент, добавляет его в список
     */
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients = [...state.ingredients, action.payload];
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() }
      })
    },
    /**
     * Удаление ингредиента
     * Удаляет ингредиент из списка, если он не является булочкой
     */
    removeIngredientById: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    /**
     * Очистка конструктора
     * Удаляет все ингредиенты и булочку
     */
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    /**
     * Перемещение ингредиента
     * Меняет местами ингредиенты в списке
     */
    moveItem: (state, action: PayloadAction<TMoveElement>) => {
      const { indexFrom, indexTo } = action.payload;
      const target = indexFrom + indexTo;
      state.ingredients = swapIngredients(state.ingredients, indexFrom, target);
    }
  },
  selectors: {
    /**
     * Получение состояния
     * Возвращает текущее состояние конструктора
     */
    selectConstructor: (state) => state,
    /**
     * Получение состава
     * Включает булочку в начале и конце
     */
    burgerComposition: (state) => {
      if (state.bun) {
        const burger: string[] = [];
        burger.push(state.bun._id);
        burger.push(
          ...state.ingredients.map(
            (ingredient: TConstructorIngredient) => ingredient._id
          )
        );
        burger.push(state.bun._id);
        return burger;
      }
      return null;
    }
  }
});

/**
 * Селекторы
 */
export const selectConstructorState = (state: RootState) =>
  state.burgerConstructor;

/**
 * Мемоизированный селектор для получения состояния конструктора
 * Возвращает копию состояния для предотвращения мутаций
 */
export const selectConstructorMemo = createSelector(
  selectConstructorState,
  (state) => ({
    bun: state.bun,
    ingredients: [...state.ingredients]
  })
);

/**
 * Мемоизированный селектор для получения состава бургера
 * Возвращает массив ID ингредиентов в правильном порядке
 */
export const burgerCompositionMemo = createSelector(
  selectConstructorState,
  (state) => {
    if (state.bun) {
      const burger: string[] = [];
      burger.push(state.bun._id);
      burger.push(...state.ingredients.map((ingredient) => ingredient._id));
      burger.push(state.bun._id);
      return burger;
    }
    return null;
  }
);

// Типы
export type ConstructorState = ReturnType<typeof selectConstructorMemo>;
export type BurgerComposition = ReturnType<typeof burgerCompositionMemo>;

export const {
  addIngredient,
  removeIngredientById,
  clearConstructor,
  moveItem
} = burgerConstructorSlice.actions;
export const { burgerComposition, selectConstructor } =
  burgerConstructorSlice.selectors;
