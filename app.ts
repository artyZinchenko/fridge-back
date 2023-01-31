import express from 'express';
import cors from 'cors';
import recipeRoute from './routes/recipes';
import mongoose from 'mongoose';
import config from './utils/config';

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
app.use('/api/recipes', recipeRoute);

export default app;
