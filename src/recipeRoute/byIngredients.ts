/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import axios from 'axios';
import { RecipeId } from '../types';
import { formatRecipes } from '../utils/formating';
import { headers } from '../utils/headers';

const route = express.Router();

export default route.post('/', async (req, res) => {
  console.log('by ingreds', req.body.ingredNameString);
  const { ingredNameString } = req.body;

  const { data }: { data: RecipeId[] } = await axios.get(
    `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredNameString}&number=10`,
    { headers: headers }
  );
  const ids = data.map((el) => el.id).toString();

  const bulkResponse = await axios.get(
    `https://api.spoonacular.com/recipes/informationBulk?ids=${ids}`,
    { headers: headers }
  );

  const recipes = await formatRecipes(bulkResponse.data);

  res.send(recipes);

  return;
});
