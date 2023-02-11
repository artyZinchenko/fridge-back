import { Fields, NewRecipe } from '../types';
import { toNewRecipe } from './utils';

export const formatRecipes = (data: any): NewRecipe[] => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
  const formatedRecipes: (null | NewRecipe)[] = data.map((el: Fields) =>
    toNewRecipe(el)
  );

  const recipes: NewRecipe[] = formatedRecipes
    .filter((recipe) => recipe !== null)
    .map((el) => el as NewRecipe);

  return recipes;
};
