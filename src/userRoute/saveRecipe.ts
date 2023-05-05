/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
// import Recipe from '../../models/recipes';
import User from '../models/users';

const route = express.Router();

export default route.post('/save-recipe', async (req, res) => {
  console.log('save recipes');

  try {
    const recipeId: string = req.body.id;

    // const recipe = await Recipe.findOne({ id: recipeId }, 'id');

    const result = await User.updateOne(
      { id: res.locals.decodedToken.uid },
      { $addToSet: { recipes: recipeId } }
    );

    return res.json({ result });
  } catch (error) {
    console.log('/save-recipe Error: ');
    console.log(error);
  }
});
