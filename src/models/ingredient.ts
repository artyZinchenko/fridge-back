import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const ingredientSchema = new Schema({
  aisle: { type: String, required: true },
  name: { type: String, required: true },
  id: { type: Number, required: true },
  image: { type: String, required: true },
  measures: {
    metric: {
      unitLong: { type: String, required: true },
      amount: { type: Number, required: true },
    },
    us: {
      unitLong: { type: String, required: true },
      amount: { type: Number, required: true },
    },
  },
});

ingredientSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);
export default Ingredient;
