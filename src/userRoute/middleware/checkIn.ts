/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import User from '../../models/users';

const route = express.Router();

export default route.use(async (_req, res, next) => {
  console.log('CHECKIN');
  try {
    const userId = res.locals.decodedToken.uid;

    const idFromDb = await User.findOne({ id: userId }, 'id');

    if (!idFromDb) {
      const newUser = new User({
        id: userId,
      });
      await newUser.save();
    }

    next();
  } catch (error) {
    if (error instanceof Error) console.log(error.message);
    return res.status(500).json({ message: 'Can not check in user' });
  }
});
