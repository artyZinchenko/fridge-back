/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import axios from 'axios';
import { formatRecipes } from '../utils/formating';
import { headers } from '../utils/headers';

const route = express.Router();

export default route.get('/', async (_req, res) => {
  const response = await axios.get(
    `https://api.spoonacular.com/recipes/random?number=4`,
    { headers: headers }
  );

  const recipes = await formatRecipes(response.data.recipes);
  res.send(recipes);

  console.log('LENGTH', recipes.length);

  return;
});
