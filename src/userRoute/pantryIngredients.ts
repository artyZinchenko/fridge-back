/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import { IngredientId, UserType } from '../../types';
import User from '../models/users';

const route = express.Router();
const savePantryIngredients = route.post(
  '/save-pantry-ingredients',
  async (req, res) => {
    console.log('save pantry ingreds');

    try {
      const ingredients: IngredientId[] = req.body.ingredients;

      const user: UserType | null = await User.findOne({
        id: res.locals.decodedToken.uid,
      });
      if (!user) return;

      const newIngredArr = user.pantryIngredients.concat(ingredients);

      const updatedDocument = await User.updateOne(
        { id: res.locals.decodedToken.uid },
        { pantryIngredients: newIngredArr },
        { new: true, upsert: true }
      );

      res.json({ updatedDocument });
    } catch (error) {
      console.log('/save-pantry-ingredients Error: ');
      console.log(error);
    }
  }
);

const deletePantryIngredients = route.post(
  '/delete-pantry-ingredients',
  async (req, res) => {
    console.log('delete pantry ingreds');

    try {
      const ingredients: IngredientId[] = req.body.ingredients;

      const user: UserType | null = await User.findOne({
        id: res.locals.decodedToken.uid,
      });
      if (!user) return;

      const newIngredArr = user.pantryIngredients.filter((el) => {
        return !ingredients.some((ingred) => ingred.id === el.id);
      });

      const updatedDocument = await User.updateOne(
        { id: res.locals.decodedToken.uid },
        { pantryIngredients: newIngredArr },
        { new: true, upsert: true }
      );

      res.json({ updatedDocument });
    } catch (error) {
      console.log('/delete-pantry-ingredients Error: ');
      console.log(error);
    }
  }
);

export default {
  savePantryIngredients,
  deletePantryIngredients,
};
