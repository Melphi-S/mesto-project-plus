import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UpdateQuery } from 'mongoose';
import User, { IUser } from '../models/user';
import HttpStatusCode from '../types/HttpStatusCode';
import { RequestCustom } from '../types';
import { SEVEN_DAYS } from '../utils/constants';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    return res.status(HttpStatusCode.OK).send(users);
  } catch (err) {
    return next(err);
  }
};

export const getUser = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId ? req.params.userId : req.user?._id;
    const user = await User.findById(userId).orFail();

    return res.status(HttpStatusCode.OK).send(user);
  } catch (err) {
    return next(err);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name, about, avatar, email, password: hash,
    });

    const resBody = newUser.toObject();
    delete resBody.password;

    return res.status(HttpStatusCode.CREATED).send(resBody);
  } catch (err) {
    return next(err);
  }
};

export const patchUser = async (
  req: RequestCustom,
  res: Response,
  next: NextFunction,
  info: UpdateQuery<IUser>,
) => {
  try {
    const patchedUser = await User.findByIdAndUpdate(
      req.user?._id,
      info,
      { new: true, runValidators: true },
    ).orFail();

    return res.status(HttpStatusCode.OK).send(patchedUser);
  } catch (err) {
    return next(err);
  }
};

export const patchUserInfo = async (req: RequestCustom, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  await patchUser(req, res, next, { name, about });
};

export const patchUserAvatar = async (req: RequestCustom, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  await patchUser(req, res, next, { avatar });
};

export const login = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    const { NODE_ENV, JWT_KEY } = process.env;
    const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_KEY as string : 'dev-secret');

    return res.status(HttpStatusCode.OK).cookie('jwt', token, {
      maxAge: SEVEN_DAYS,
      httpOnly: true,
    }).end();
  } catch (err) {
    return next(err);
  }
};
