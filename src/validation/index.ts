import { celebrate, Joi } from 'celebrate';
import { isObjectIdOrHexString } from 'mongoose';
import ErrorMessage from '../types/ErrorMessage';
import { validLinkRegexp } from '../utils/constants';

export const getUserValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().custom((value) => {
      if (!isObjectIdOrHexString(value)) {
        throw new Error(ErrorMessage.INCORRECT_ID);
      }
      return value;
    }),
  }),
});

export const idValidation = (id: string) => celebrate({
  params: Joi.object().keys({
    [id]: Joi.string().required().custom((value) => {
      if (!isObjectIdOrHexString(value)) {
        throw new Error(ErrorMessage.INCORRECT_ID);
      }
      return value;
    }),
  }),
});

export const createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().pattern(validLinkRegexp),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

export const patchUserInfoValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(200),
  }),
});

export const patchUserAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(validLinkRegexp),
  }),
});

export const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

export const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(validLinkRegexp),
  }),
});
