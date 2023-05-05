/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import axios from 'axios';
import { ResultArr } from '../../types';
import { formatRecipes } from '../utils/formating';
import { headers } from '../utils/headers';

const route = express.Router();

export default route.post('/', async (req, res) => {
  console.log('complex search', req.body.options);

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
    `https://api.spoonacular.com/recipes/complexSearch?number=10` +
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

  const recipes = await formatRecipes(bulkResponse.data);

  res.send(recipes);

  return;
});
