/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import admin from '../../config/firebase-config';

const route = express.Router();

route.use(async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Token is Missing' });

    const decodedToken = await admin.auth().verifyIdToken(token);
    if (decodedToken) {
      res.locals.decodedToken = decodedToken;
      next();
    } else {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  } catch (error) {
    if (error instanceof Error) console.log(error.message);
    return res.status(401).json({ message: 'Unauthorized' });
  }
});

export default route;
