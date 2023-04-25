import { Request, Response } from 'express';
import User from '../models/user';
import HttpStatusCode from '../types/HttpStatusCode';
import { ErrorMessage } from '../types/ErrorMessage';
import { RequestCustom } from '../types';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    return res.status(HttpStatusCode.OK).send(users);
  } catch (e) {
    return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .send({ message: ErrorMessage.INTERNAL_SERVER_ERROR });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      throw new Error(ErrorMessage.USER_NOT_FOUND);
    }

    return res.status(HttpStatusCode.OK).send(user);
  } catch (e) {
    if (e instanceof Error && e.message === ErrorMessage.USER_NOT_FOUND) {
      return res
        .status(HttpStatusCode.NOT_FOUND)
        .send({ message: e.message });
    }

    return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .send({ message: ErrorMessage.INTERNAL_SERVER_ERROR });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, about, avatar } = req.body;

    if (!name || !about || !avatar) {
      throw new Error(ErrorMessage.INVALID_DATA);
    }

    const newUser = await User.create(req.body);
    return res.status(HttpStatusCode.CREATED).send(newUser);
  } catch (e) {
    if (e instanceof Error && e.message === ErrorMessage.INVALID_DATA) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: e.message });
    }

    return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .send({ message: ErrorMessage.INTERNAL_SERVER_ERROR });
  }
};

export const patchUser = async (req: RequestCustom, res: Response) => {
  try {
    const { name, about } = req.body;

    if (!name || !about) {
      throw new Error(ErrorMessage.INVALID_DATA);
    }

    const patchedUser = await User.findByIdAndUpdate(req.user?._id, req.body, { new: true });

    if (!patchedUser) {
      throw new Error(ErrorMessage.USER_NOT_FOUND);
    }

    return res.status(HttpStatusCode.OK).send(patchedUser);
  } catch (e) {
    if (e instanceof Error && e.message === ErrorMessage.INVALID_DATA) {
      return res
        .status(HttpStatusCode.NOT_FOUND)
        .send({ message: e.message });
    }

    return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .send({ message: ErrorMessage.INTERNAL_SERVER_ERROR });
  }
};

export const patchAvatar = async (req: RequestCustom, res: Response) => {
  try {
    const { avatar } = req.body;

    if (!avatar) {
      throw new Error(ErrorMessage.INVALID_DATA);
    }

    const patchedUser = await User.findByIdAndUpdate(req.user?._id, req.body, { new: true });

    if (!patchedUser) {
      throw new Error(ErrorMessage.USER_NOT_FOUND);
    }

    return res.status(HttpStatusCode.OK).send(patchedUser);
  } catch (e) {
    if (e instanceof Error && e.message === ErrorMessage.INVALID_DATA) {
      return res
        .status(HttpStatusCode.NOT_FOUND)
        .send({ message: e.message });
    }

    return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .send({ message: ErrorMessage.INTERNAL_SERVER_ERROR });
  }
};
