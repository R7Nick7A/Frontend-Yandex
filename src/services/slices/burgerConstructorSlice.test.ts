import { burgerConstructorSlice, initialState } from './burgerConstructorSlice';
import { addIngredient, removeIngredientById, clearConstructor, moveItem } from './burgerConstructorSlice';

describe('burgerConstructorSlice', () => {
  const mockIngredient = {
    _id: '1',
    name: 'Test Ingredient',
    type: 'main',
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 100,
    price: 100,
    image: 'test.jpg',
    image_mobile: 'test-mobile.jpg',
    image_large: 'test-large.jpg',
    __v: 0
  };

  const mockBun = {
    ...mockIngredient,
    type: 'bun'
  };

  it('должен обрабатывать добавление ингредиента', () => {
    const nextState = burgerConstructorSlice.reducer(
      initialState,
      addIngredient(mockIngredient)
    );
    expect(nextState.ingredients).toHaveLength(1);
    expect(nextState.ingredients[0].name).toBe('Test Ingredient');
  });

  it('должен обрабатывать добавление булочки', () => {
    const nextState = burgerConstructorSlice.reducer(
      initialState,
      addIngredient(mockBun)
    );
    expect(nextState.bun).not.toBeNull();
    expect(nextState.bun?.name).toBe('Test Ingredient');
  });

  it('должен обрабатывать удаление ингредиента', () => {
    const stateWithIngredient = burgerConstructorSlice.reducer(
      initialState,
      addIngredient(mockIngredient)
    );
    const nextState = burgerConstructorSlice.reducer(
      stateWithIngredient,
      removeIngredientById(stateWithIngredient.ingredients[0].id)
    );
    expect(nextState.ingredients).toHaveLength(0);
  });

  it('должен очищать конструктор', () => {
    const stateWithItems = burgerConstructorSlice.reducer(
      initialState,
      addIngredient(mockIngredient)
    );
    const nextState = burgerConstructorSlice.reducer(
      stateWithItems,
      clearConstructor()
    );
    expect(nextState.ingredients).toHaveLength(0);
    expect(nextState.bun).toBeNull();
  });
}); 