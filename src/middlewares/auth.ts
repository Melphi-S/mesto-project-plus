import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { RequestCustom } from '../types';
import { ErrorMessage } from '../types/ErrorMessage';

export default (req: RequestCustom, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new Error(ErrorMessage.NO_AUTH);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  const { NODE_ENV, JWT_KEY } = process.env;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_KEY as string : 'dev-secret') as {_id: string};
  } catch (e) {
    throw new Error(ErrorMessage.NO_AUTH);
  }

  req.user = payload;

  return next();
};
