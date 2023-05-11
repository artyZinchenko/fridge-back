export interface UserType {
  id: string;
  ingredients: IngredFromApi[];
  recipes: number[];
  pantryIngredients: IngredientId[];
}

export interface IngredFromApi {
  aisle: string;
  name: string;
  id: number;
  measures: Measures;
  image: string;
}

export interface Measures {
  metric: MeasuresObj;
  us: MeasuresObj;
}

export interface MeasuresObj {
  amount: number;
  unitLong: string;
}

export interface ResultArr {
  results: RecipeId[];
}

export interface RecipeId {
  id: number;
}

export interface IngredientId {
  name: string;
  id: number;
}

export interface Fields {
  id: unknown;
  title: unknown;
  image: unknown;
  imageType: unknown;
  readyInMinutes: unknown;
  sourceName: unknown;
  servings: unknown;
  sourceUrl: unknown;
  aggregateLikes: unknown;
  healthScore: unknown;
  cheap: unknown;
  cuisines: unknown;
  dairyFree: unknown;
  glutenFree: unknown;
  ketogenic: unknown;
  vegan: unknown;
  veryHealthy: unknown;
  veryPopular: unknown;
  extendedIngredients: unknown;
  summary: unknown;
  creditsText: unknown;
}

export interface NewRecipe {
  id: number;
  title: string;
  image: string;
  imageType: 'jpg' | 'JPG' | 'png' | 'PNG' | 'JPEG' | 'jpeg';
  readyInMinutes: number;
  sourceName: string;
  sourceUrl: string;
  aggregateLikes: number;
  healthScore: number;
  cheap: boolean;
  servings: number;
  cuisines: Array<string>;
  dairyFree: boolean;
  glutenFree: boolean;
  vegan: boolean;
  veryHealthy: boolean;
  veryPopular: boolean;
  extendedIngredients: IngredFromApi[];
  summary: string;
  creditsText: string;
}
