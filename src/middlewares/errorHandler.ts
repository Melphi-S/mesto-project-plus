import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';
import { ErrorCustom } from '../types';
import HttpStatusCode from '../types/HttpStatusCode';
import { ErrorMessage } from '../types/ErrorMessage';

export default (err: ErrorCustom | Error, req: Request, res: Response, next: NextFunction) => {
  if ('code' in err && err.code === 11000) {
    return res
      .status(HttpStatusCode.CONFLICT)
      .send({ message: ErrorMessage.NOT_UNIQUE_EMAIL });
  }

  if (err.message === ErrorMessage.INVALID_EMAIL_OR_PASSWORD) {
    return res
      .status(HttpStatusCode.UNAUTHORIZED)
      .send({ message: err.message });
  }

  if (err.message === ErrorMessage.NO_AUTH) {
    return res
      .status(HttpStatusCode.FORBIDDEN)
      .send({ message: err.message });
  }

  if (err.message === ErrorMessage.ACCESS_DENIED) {
    return res
      .status(HttpStatusCode.FORBIDDEN)
      .send({ message: err.message });
  }

  if (err instanceof Error.ValidationError
    || err instanceof Error.CastError) {
    return res
      .status(HttpStatusCode.BAD_REQUEST)
      .send({ message: ErrorMessage.INVALID_DATA });
  }

  if (err instanceof Error.DocumentNotFoundError) {
    return res
      .status(HttpStatusCode.NOT_FOUND)
      .send({ message: ErrorMessage.DATA_NOT_FOUND });
  }

  res
    .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
    .send({ message: ErrorMessage.INTERNAL_SERVER_ERROR });

  return next();
};
