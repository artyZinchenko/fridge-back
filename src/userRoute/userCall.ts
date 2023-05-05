/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';

const route = express.Router();

export default route.get('/', (_req, _res) => {
  console.log('yees');
});
