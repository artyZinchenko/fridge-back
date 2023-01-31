/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import axios from 'axios';
import { toNewRecipe } from '../utils';
import { Fields, ResultArr, NewRecipe, RecipeId } from '../types';
import {
  saveIngredientsToDB,
  saveRecipesToDB,
} from '../services/databaseServices';

const route = express.Router();

route.post('/byIngredients', async (req, res) => {
  console.log('by ingreds');
  const { ingredNameString } = req.body;
  try {
    const { data }: { data: RecipeId[] } = await axios.get(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredNameString}&number=2`,
      {
        headers: {
          'Accept-Encoding': 'gzip,deflate,compress',
          'x-api-key': process.env.FOOD_API_KEY,
        },
      }
    );
    const ids = data.map((el) => el.id).toString();

    const bulkResponse = await axios.get(
      `https://api.spoonacular.com/recipes/informationBulk?ids=${ids}`,
      {
        headers: {
          'Accept-Encoding': 'gzip,deflate,compress',
          'x-api-key': process.env.FOOD_API_KEY,
        },
      }
    );

    console.log('information bulk', bulkResponse.data.length);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const formatedRecipes: (null | NewRecipe)[] = bulkResponse.data.map(
      (el: Fields) => toNewRecipe(el)
    );

    const recipes: NewRecipe[] = formatedRecipes
      .filter((recipe) => recipe !== null)
      .map((el) => el as NewRecipe);

    res.send(recipes);

    await saveIngredientsToDB(recipes);
    await saveRecipesToDB(recipes);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong';

    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }

    console.log(errorMessage);
    res.send(error);
  }
});

route.post('/complexSearch', async (req, res) => {
  console.log('post');
  const mealType: string = req.body.options.mealType
    ? `&type=${req.body.options.mealType}`
    : '';
  const cuisineType: string = req.body.options.cuisineType
    ? `&cuisine=${req.body.options.cuisineType}`
    : '';
  const dietType: string = req.body.options.dietType
    ? `&diet=${req.body.options.dietType}`
    : '';
  try {
    const { data }: { data: ResultArr } = await axios.get(
      `https://api.spoonacular.com/recipes/complexSearch?number=2` +
        mealType +
        cuisineType +
        dietType,
      {
        headers: {
          'Accept-Encoding': 'gzip,deflate,compress',
          'x-api-key': process.env.FOOD_API_KEY,
        },
      }
    );
    console.log('complex search', data.results.length);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const ids = data.results.map((el) => el.id).toString();

    const bulkResponse = await axios.get(
      `https://api.spoonacular.com/recipes/informationBulk?ids=${ids}`,
      {
        headers: {
          'Accept-Encoding': 'gzip,deflate,compress',
          'x-api-key': process.env.FOOD_API_KEY,
        },
      }
    );

    console.log('information bulk', bulkResponse.data.length);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const formatedRecipes: (null | NewRecipe)[] = bulkResponse.data.map(
      (el: Fields) => toNewRecipe(el)
    );

    res.send(formatedRecipes.filter((recipe) => recipe !== null));
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
    res.send(error);
  }
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
