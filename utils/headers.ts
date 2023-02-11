import * as dotenv from 'dotenv';
dotenv.config();

export const headers = {
  'Accept-Encoding': 'gzip,deflate,compress',
  'x-api-key': process.env.FOOD_API_KEY,
};
