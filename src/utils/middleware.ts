/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Request, Response, NextFunction } from 'express';

interface ResponseError extends Error {
  statusCode?: number;
}

const errorHandling = (
  err: ResponseError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  } else if (err.name === 'ECONNRESET') {
    console.log('Client closed connection');
    return res.status(400).json({ error: err.message });
  } else {
    console.log('Middleware Error Hadnling');
    const errStatus = err.statusCode || 500;
    const errMsg = err.message || 'Something went wrong';
    res.status(errStatus).json({
      success: false,
      status: errStatus,
      message: errMsg,
      // stack: process.env.NODE_ENV === 'development' ? err.stack : {},
    });
  }

  // next(err);
};

const unknownEndpoint = (_req: Request, res: Response) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

export default { errorHandling, unknownEndpoint };
