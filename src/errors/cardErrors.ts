import { Error } from 'mongoose';
import { Response } from 'express';
import HttpStatusCode from '../types/HttpStatusCode';
import { ErrorMessage } from '../types/ErrorMessage';

export const catchCardError = (e: unknown, res: Response) => {
  if (e instanceof Error.ValidationError
    || e instanceof Error.CastError) {
    return res
      .status(HttpStatusCode.BAD_REQUEST)
      .send({ message: ErrorMessage.INVALID_DATA });
  }

  if (e instanceof Error.DocumentNotFoundError) {
    return res
      .status(HttpStatusCode.NOT_FOUND)
      .send({ message: ErrorMessage.CARD_NOT_FOUND });
  }

  return res
    .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
    .send({ message: ErrorMessage.INTERNAL_SERVER_ERROR });
};
