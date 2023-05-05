/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import axios from 'axios';
import { formatRecipes } from '../utils/formating';
import { headers } from '../utils/headers';

const route = express.Router();

export default route.post('/', async (req, res) => {
  console.log('get recipes by ids');
  try {
    const ids: number[] = req.body.ids;

    const bulkResponse = await axios.get(
      `https://api.spoonacular.com/recipes/informationBulk?ids=${ids.toString()}`,
      { headers: headers }
    );

    const recipes = await formatRecipes(bulkResponse.data);

    console.log(`foung ${recipes.length} recipes`);

    res.send(recipes);
  } catch (error) {
    console.log('/user-recipes Error: ');
    console.log(error);
  }
});
