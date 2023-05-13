/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';

const route = express.Router();

export default route.get('/', (_req, res) => {
  res.send({ message: 'oh, you again...' });
});
