import { Request, Response } from 'express';
import User, { IUser } from '../models/user';
import HttpStatusCode from '../types/HttpStatusCode';
import { RequestCustom } from '../types';
import { catchError } from '../errors/errors';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    return res.status(HttpStatusCode.OK).send(users);
  } catch (e) {
    return catchError(e, res);
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail();

    return res.status(HttpStatusCode.OK).send(user);
  } catch (e) {
    return catchError(e, res);
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, about, avatar } = req.body;

    const newUser = await User.create({ name, about, avatar });
    return res.status(HttpStatusCode.CREATED).send(newUser);
  } catch (e) {
    return catchError(e, res);
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
    return catchError(e, res);
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
