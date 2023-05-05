import mongoose from 'mongoose';
import { ingredientSchema } from './ingredient';
import { pantryIngredientSchema } from './pantryIngredient';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: { type: String, required: true },
  ingredients: [ingredientSchema],
  recipes: { type: [Number] },
  pantryIngredients: [pantryIngredientSchema],
});

userSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const User = mongoose.model('User', userSchema);
export default User;
