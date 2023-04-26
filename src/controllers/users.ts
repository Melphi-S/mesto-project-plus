import { Request, Response } from 'express';
import { Error } from 'mongoose';
import User, { IUser } from '../models/user';
import HttpStatusCode from '../types/HttpStatusCode';
import { ErrorMessage } from '../types/ErrorMessage';
import { RequestCustom } from '../types';
import { catchUserError } from '../errors/userErrors';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).orFail();
    return res.status(HttpStatusCode.OK).send(users);
  } catch (e) {
    if (e instanceof Error.DocumentNotFoundError) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: ErrorMessage.PAGE_NOT_FOUND });
    }

    return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .send({ message: ErrorMessage.INTERNAL_SERVER_ERROR });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail();

    return res.status(HttpStatusCode.OK).send(user);
  } catch (e) {
    return catchUserError(e, res);
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, about, avatar } = req.body;

    const newUser = await User.create({ name, about, avatar });
    return res.status(HttpStatusCode.CREATED).send(newUser);
  } catch (e) {
    if (e instanceof Error.ValidationError
      || e instanceof Error.CastError) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: ErrorMessage.INVALID_DATA });
    }

    return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .send({ message: ErrorMessage.INTERNAL_SERVER_ERROR });
  }
};

export const patchUser = async <T>(req: RequestCustom, res: Response, info: T) => {
  try {
    const patchedUser = await User.findByIdAndUpdate(
      req.user?._id,
      info,
      { new: true, runValidators: true },
    ).orFail();

    return res.status(HttpStatusCode.OK).send(patchedUser);
  } catch (e) {
    return catchUserError(e, res);
  }
};

export const patchUserInfo = async (req: RequestCustom, res: Response) => {
  const { name, about } = req.body;
  await patchUser<Omit<IUser, 'avatar'>>(req, res, { name, about });
};

export const patchUserAvatar = async (req: RequestCustom, res: Response) => {
  const { avatar } = req.body;
  await patchUser<Pick<IUser, 'avatar'>>(req, res, { avatar });
};
