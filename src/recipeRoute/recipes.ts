/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import axios from 'axios';
import { headers } from '../utils/headers';
import getByIngredients from './byIngredients';
import getRandomRecipes from './randomRecipes';
import getComplexSearch from './complexSearch';
import getByTitle from './byTitle';
import getByIds from './byIds';

const route = express.Router();

route.use('/byIds', getByIds);
route.use('/byIngredients', getByIngredients);
route.use('/randomRecipes', getRandomRecipes);
route.use('/complexSearch', getComplexSearch);
route.use('/byTitle', getByTitle);

route.post(`/autocomplete`, async (req, res, next) => {
  const text = req.body.letters;
  console.log(typeof text, text);

  try {
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/autocomplete?number=10&query=${text}`,
      { headers: headers }
    );
    return res.send(response.data);
  } catch (err) {
    next(err);
  }
});

export default route;
