/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import { IngredFromApi } from '../../types';
import User from '../models/users';

const route = express.Router();

export default route.post('/delete-ingredient', async (req, res) => {
  console.log('delete ingred');

  try {
    const ingredient: IngredFromApi = req.body.ingredient;
    const { id } = ingredient;

    await User.findOneAndUpdate(
      { id: res.locals.decodedToken.uid },
      { $pull: { ingredients: id } },
      { new: true },
      (err, updatedDocument) => {
        if (err) {
          console.log(err);
        } else {
          console.log(updatedDocument);
          return res.json({ updatedDocument });
        }
      }
    );
  } catch (error) {
    console.log('/delete-ingredient Error: ');
    console.log(error);
  }
});
