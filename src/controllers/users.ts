import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user';
import HttpStatusCode from '../types/HttpStatusCode';
import { RequestCustom } from '../types';
import { catchError } from '../errors/errors';
import { ErrorMessage } from '../types/ErrorMessage';
import { SEVEN_DAYS } from '../variables';

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
    const {
      name, about, avatar, email, password,
    } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name, about, avatar, email, password: hash,
    });
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
  await patchUser<Pick<IUser, 'name' | 'about'>>(req, res, { name, about });
};

export const patchUserAvatar = async (req: RequestCustom, res: Response) => {
  const { avatar } = req.body;
  await patchUser<Pick<IUser, 'avatar'>>(req, res, { avatar });
};

export const login = async (req: RequestCustom, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    const { NODE_ENV, JWT_KEY } = process.env;
    const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_KEY as string : 'dev-secret');

    return res.status(HttpStatusCode.OK).cookie('jwt', token, {
      maxAge: SEVEN_DAYS,
      httpOnly: true,
    }).end();
  } catch (e) {
    return res
      .status(HttpStatusCode.UNAUTHORIZED)
      .send({ message: ErrorMessage.INVALID_EMAIL_OR_PASSWORD });
  }
};
