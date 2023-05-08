import express from 'express';
import cors from 'cors';
import recipeRoute from './recipeRoute/recipes';
import userRoute from './userRoute/users';
import ingredientRoute from './ingredientRoute/ingredients';
import mongoose from 'mongoose';
import config from './utils/config';
import middleware from './utils/middleware';

const app = express();

if (!config.MONGODB_URI) {
  console.error('MONGODB_URI not set in config file');
  process.exit(1);
}

mongoose
  .connect(config.MONGODB_URI)
  .then(() => console.log('connected to MongoDB'))
  .catch((err) => console.log('error connectiong to MongoDB', err.message));

app.use(cors());
app.use(express.json());
app.use('/api/users', userRoute);
app.use('/api/recipes', recipeRoute);
app.use('/api/ingredients', ingredientRoute);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandling);

export default app;
