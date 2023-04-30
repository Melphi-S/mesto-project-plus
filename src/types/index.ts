import { Request } from 'express';
import { Error } from 'mongoose';

export interface RequestCustom extends Request {
  user?: {
    _id: string;
  };
}

export interface ErrorCustom extends Error {
  code?: number;
}
