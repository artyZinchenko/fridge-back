/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Fields, NewRecipe } from '../types';
import { toNewRecipe } from './utils';

export const formatRecipes = async (data: any): Promise<NewRecipe[]> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
  const promises = data.map(async (el: Fields) => await toNewRecipe(el));

  const formatedRecipes: (null | NewRecipe)[] = await Promise.all(promises);

  const recipes: NewRecipe[] = formatedRecipes
    .filter((recipe) => recipe !== null)
    .map((el) => el as NewRecipe);

  return recipes;
};
