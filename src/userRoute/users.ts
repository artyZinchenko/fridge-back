import express from 'express';
import decodeToken from './middleware/decodeToken';
import checkIn from './middleware/checkIn';
import saveRecipe from './saveRecipe';
import getUserData from './getUserData';
import userCall from './userCall';
import saveIngredients from './saveIngredients';
import pantryIngredients from './pantryIngredients';

const route = express.Router();

route.use(decodeToken);
route.use(checkIn);
route.use(userCall);
route.use(getUserData);
route.use(saveRecipe);
route.use(saveIngredients);
route.use(pantryIngredients.savePantryIngredients);
route.use(pantryIngredients.deletePantryIngredients);

export default route;
