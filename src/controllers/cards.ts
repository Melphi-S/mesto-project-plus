import { Request, Response } from 'express';
import Card from '../models/card';
import HttpStatusCode from '../types/HttpStatusCode';
import { ErrorMessage } from '../types/ErrorMessage';
import { RequestCustom } from '../types';

export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find({});
    return res.status(HttpStatusCode.OK).send(cards);
  } catch (e) {
    return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .send({ message: ErrorMessage.INTERNAL_SERVER_ERROR });
  }
};

export const createCard = async (req: RequestCustom, res: Response) => {
  try {
    const { name, link } = req.body;

    if (!name || !link) {
      throw new Error(ErrorMessage.INVALID_DATA);
    }

    const newCard = await Card.create({ name, link, owner: req.user?._id });
    return res.status(HttpStatusCode.CREATED).send(newCard);
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

export const deleteCard = async (req: RequestCustom, res: Response) => {
  try {
    const { cardId } = req.params;

    if (!cardId) {
      throw new Error(ErrorMessage.INVALID_DATA);
    }

    const deletedCard = await Card.findByIdAndDelete(cardId);
    if (!deletedCard) {
      throw new Error(ErrorMessage.CARD_NOT_FOUND);
    }
    return res.status(HttpStatusCode.OK).send(deletedCard);
  } catch (e) {
    if (e instanceof Error
      && (e.message === ErrorMessage.INVALID_DATA || e.message === ErrorMessage.CARD_NOT_FOUND)) {
      return res
        .status(HttpStatusCode.NOT_FOUND)
        .send({ message: e.message });
    }

    return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .send({ message: ErrorMessage.INTERNAL_SERVER_ERROR });
  }
};

export const likeCard = async (req: RequestCustom, res: Response) => {
  try {
    const { cardId } = req.params;

    if (!cardId) {
      throw new Error(ErrorMessage.INVALID_DATA);
    }

    const likedCard = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user?._id } },
      { new: true },
    );

    if (!likedCard) {
      throw new Error(ErrorMessage.CARD_NOT_FOUND);
    }

    return res.status(HttpStatusCode.OK).send(likedCard);
  } catch (e) {
    if (e instanceof Error
      && (e.message === ErrorMessage.INVALID_DATA || e.message === ErrorMessage.CARD_NOT_FOUND)) {
      return res
        .status(HttpStatusCode.NOT_FOUND)
        .send({ message: e.message });
    }

    return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .send({ message: ErrorMessage.INTERNAL_SERVER_ERROR });
  }
};

export const dislikeCard = async (req: RequestCustom, res: Response) => {
  try {
    const { cardId } = req.params;

    if (!cardId) {
      throw new Error(ErrorMessage.INVALID_DATA);
    }

    const dislikedCard = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user?._id } as any },
      { new: true },
    );

    if (!dislikedCard) {
      throw new Error(ErrorMessage.CARD_NOT_FOUND);
    }

    return res.status(HttpStatusCode.OK).send(dislikedCard);
  } catch (e) {
    if (e instanceof Error
      && (e.message === ErrorMessage.INVALID_DATA || e.message === ErrorMessage.CARD_NOT_FOUND)) {
      return res
        .status(HttpStatusCode.NOT_FOUND)
        .send({ message: e.message });
    }

    return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .send({ message: ErrorMessage.INTERNAL_SERVER_ERROR });
  }
};
