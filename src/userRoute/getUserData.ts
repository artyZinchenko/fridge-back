/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import User from '../models/users';

const route = express.Router();

export default route.get('/user-data', async (_req, res) => {
  console.log('GET USER DATA');
  try {
    const userId: string = res.locals.decodedToken.uid;

    const user = await User.findOne({ id: userId });
    if (!user) {
      throw new Error('user not found');
    } else {
      const recipes = user.get('recipes');
      const ingredients = user.get('ingredients');
      const pantryIngredients = user.get('pantryIngredients');
      res.json({ recipes, ingredients, pantryIngredients });
    }
  } catch (error) {
    console.log('/user-data Error: ');
    console.log(error);
  }
});
