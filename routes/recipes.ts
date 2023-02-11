/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import axios from 'axios';
import { ResultArr, RecipeId } from '../types';
import {
  saveIngredientsToDB,
  saveRecipesToDB,
} from '../services/databaseServices';
import { formatRecipes } from '../utils/formating';
import { headers } from '../utils/headers';

const route = express.Router();

route.post('/byIngredients', async (req, res) => {
  console.log('by ingreds');
  const { ingredNameString } = req.body;

  const { data }: { data: RecipeId[] } = await axios.get(
    `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredNameString}&number=2`,
    { headers: headers }
  );
  const ids = data.map((el) => el.id).toString();

  const bulkResponse = await axios.get(
    `https://api.spoonacular.com/recipes/informationBulk?ids=${ids}`,
    { headers: headers }
  );

  const recipes = formatRecipes(bulkResponse.data);

  res.send(recipes);

  await saveIngredientsToDB(recipes);
  await saveRecipesToDB(recipes);
});

route.get('/randomRecipes', async (_req, res) => {
  const response = await axios.get(
    `https://api.spoonacular.com/recipes/random?number=1`,
    { headers: headers }
  );

  const recipes = formatRecipes(response.data.recipes);

  res.send(recipes);

  await saveIngredientsToDB(recipes);
  await saveRecipesToDB(recipes);
});

route.post('/complexSearch', async (req, res) => {
  const mealType: string = req.body.options.mealType
    ? `&type=${req.body.options.mealType}`
    : '';
  const cuisineType: string = req.body.options.cuisineType
    ? `&cuisine=${req.body.options.cuisineType}`
    : '';
  const dietType: string = req.body.options.dietType
    ? `&diet=${req.body.options.dietType}`
    : '';

  const { data }: { data: ResultArr } = await axios.get(
    `https://api.spoonacular.com/recipes/complexSearch?number=2` +
      mealType +
      cuisineType +
      dietType,
    {
      headers: headers,
    }
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const ids = data.results.map((el) => el.id).toString();

  const bulkResponse = await axios.get(
    `https://api.spoonacular.com/recipes/informationBulk?ids=${ids}`,
    {
      headers: headers,
    }
  );

  const recipes = formatRecipes(bulkResponse.data);

  res.send(recipes);

  await saveIngredientsToDB(recipes);
  await saveRecipesToDB(recipes);
});

// route.get('/:id', async (req, res) => {
//   try {
//     const id = req.params.id;
//     const { data }: { data: DetailedFields } = await axios.get(
//       `https://api.spoonacular.com/recipes/${id}/information`,
//       {
//         headers: {
//           'Accept-Encoding': 'gzip,deflate,compress',
//           'x-api-key': process.env.FOOD_API_KEY,
//         },
//       }
//     );
//     const formatedInfo: NewDetailedRecipeEntry = toNewDetailedRecipe(data);
//     console.log(formatedInfo);
//     res.send(formatedInfo);
//   } catch (error: unknown) {
//     let errorMessage = 'Something went wrong';
//     if (error instanceof Error) {
//       errorMessage += ' Error: ' + error.message;
//     }
//     console.log(errorMessage);
//     res.send(error);
//   }
// });

export default route;
