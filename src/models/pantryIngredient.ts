import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const pantryIngredientSchema = new Schema({
  id: { type: Number, required: true },
  image: { type: String, required: false },
  name: { type: String, required: true },
});

pantryIngredientSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const PantryIngredient = mongoose.model(
  'PantryIngredient',
  pantryIngredientSchema
);
export default PantryIngredient;
