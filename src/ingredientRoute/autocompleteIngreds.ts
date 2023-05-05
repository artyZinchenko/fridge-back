/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import ingredientsList from '../data/ingredientsList';

const route = express.Router();

route.post(`/`, (req, res) => {
  const { letters }: { letters: string } = req.body;
  console.log('autocomplete', letters);

  const result = ingredientsList
    .filter((ingredient) => {
      return ingredient.name.includes(letters.toLowerCase());
    })
    .slice(0, 10);

  return res.send(result);
});

export default route;
