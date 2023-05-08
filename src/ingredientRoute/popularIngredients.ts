/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import { IngredientId } from '../types';
import ingredientsList from '../data/ingredientsList';
import { popularIngreds } from '../data/popularIngredients';

const route = express.Router();

route.get(`/`, (_req, res) => {
  console.log('Popular Ingredients');
  // const ingredients: IngredientId[] = req.body.addedIngredients;
  // let result;

  // // filtering out ingredients that user already has
  // if (ingredients) {
  //   result = popularIngreds.filter(
  //     (el) =>
  //       !ingredients.some(
  //         (ingred) => ingred.name.toLowerCase() === el.toLowerCase()
  //       )
  //   );
  // } else {
  //   result = popularIngreds;
  // }

  // populating future response with data from ingredientsList
  const responseArr: IngredientId[] = [];

  popularIngreds.map((el) => {
    const index = ingredientsList.findIndex(
      (ingred) => ingred.name.toLowerCase() === el.toLowerCase()
    );
    if (index >= 0) {
      responseArr.push(ingredientsList[index]);
    }
  });

  return res.send(responseArr);
});

export default route;
