/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import { IngredFromApi, UserType } from '../../types';
import User from '../models/users';

const route = express.Router();

export default route.post('/save-ingredients', async (req, res) => {
  console.log('save ingreds');
  console.log('RECIVED', req.body.ingredients[0].measures.us);
  try {
    const ingredients: IngredFromApi[] = req.body.ingredients;

    const user: UserType | null = await User.findOne({
      id: res.locals.decodedToken.uid,
    });
    const newIngredientsArr: IngredFromApi[] = [];
    if (!user) return;

    ingredients.map((ingred) => {
      const indexInArr = user.ingredients.findIndex((i) => i.id === ingred.id);
      if (indexInArr >= 0) {
        user.ingredients[indexInArr].measures.metric.amount +=
          ingred.measures.metric.amount;
        user.ingredients[indexInArr].measures.us.amount +=
          ingred.measures.us.amount;
        newIngredientsArr.push(user.ingredients[indexInArr]);
      } else {
        newIngredientsArr.push(ingred);
      }
    });

    const updatedDocument = await User.updateOne(
      { id: res.locals.decodedToken.uid },
      { ingredients: newIngredientsArr },
      { new: true, upsert: true }
    );

    res.json({ updatedDocument });
  } catch (error) {
    console.log('/save-ingredients Error: ');
    console.log(error);
  }
});
