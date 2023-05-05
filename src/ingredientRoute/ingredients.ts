/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import autocompleteIngreds from './autocompleteIngreds';
import popularIngredients from './popularIngredients';

const route = express.Router();

route.use('/autocomplete', autocompleteIngreds);
route.use('/popularIngredients', popularIngredients);

export default route;
