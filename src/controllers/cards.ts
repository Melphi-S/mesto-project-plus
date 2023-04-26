import { Request, Response } from 'express';
import { Error } from 'mongoose';
import Card from '../models/card';
import HttpStatusCode from '../types/HttpStatusCode';
import { ErrorMessage } from '../types/ErrorMessage';
import { RequestCustom } from '../types';
import { catchCardError } from '../errors/cardErrors';

export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']).orFail();

    return res.status(HttpStatusCode.OK).send(cards);
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

export const createCard = async (req: RequestCustom, res: Response) => {
  try {
    const { name, link } = req.body;
    const newCard = await Card.create(
      { name, link, owner: req.user?._id },
    );

    return res.status(HttpStatusCode.CREATED).send(newCard);
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

export const deleteCard = async (req: RequestCustom, res: Response) => {
  try {
    const { cardId } = req.params;
    const deletedCard = await Card.findByIdAndDelete(cardId).orFail();

    return res.status(HttpStatusCode.OK).send(deletedCard);
  } catch (e) {
    return catchCardError(e, res);
  }
};

export const likeCard = async (req: RequestCustom, res: Response) => {
  try {
    const { cardId } = req.params;

    const likedCard = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user?._id } },
      { new: true },
    ).orFail();

    return res.status(HttpStatusCode.OK).send(likedCard);
  } catch (e) {
    return catchCardError(e, res);
  }
};

export const dislikeCard = async (req: RequestCustom, res: Response) => {
  try {
    const { cardId } = req.params;

    const dislikedCard = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user?._id } as any },
      { new: true },
    ).orFail();

    return res.status(HttpStatusCode.OK).send(dislikedCard);
  } catch (e) {
    return catchCardError(e, res);
  }
};
