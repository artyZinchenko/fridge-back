import mongoose from 'mongoose';
// eslint-disable-next-line @typescript-eslint/no-unused-vars

const Schema = mongoose.Schema;

const recipeSchema = new Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  imageType: { type: String, required: true },
  readyInMinutes: { type: Number, required: true },
  sourceName: { type: String, required: true },
  sourceUrl: { type: String, required: true },
  aggregateLikes: { type: Number, required: true },
  healthScore: { type: Number, required: true },
  cheap: { type: Boolean, required: true },
  servings: { type: Number, required: true },
  cuisines: { type: [String], required: true },
  dairyFree: { type: Boolean, required: true },
  glutenFree: { type: Boolean, required: true },
  vegan: { type: Boolean, required: true },
  veryHealthy: { type: Boolean, required: true },
  veryPopular: { type: Boolean, required: true },
  extendedIngredients: [{ type: Schema.Types.ObjectId, ref: 'Ingredient' }],
  summary: { type: String, required: true },
  creditsText: { type: String, required: true },
});

recipeSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Recipe = mongoose.model('Recipe', recipeSchema);
export default Recipe;
