import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
import HttpStatusCode from '../types/HttpStatusCode';
import { RequestCustom } from '../types';
import { ErrorMessage } from '../types/ErrorMessage';

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);

    return res.status(HttpStatusCode.OK).send(cards);
  } catch (err) {
    return next(err);
  }
};

export const createCard = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;
    const newCard = await Card.create(
      { name, link, owner: req.user?._id },
    );

    return res.status(HttpStatusCode.CREATED).send(newCard);
  } catch (err) {
    return next(err);
  }
};

export const deleteCard = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;

    const cardToDelete = await Card.findById(cardId).orFail();

    if (cardToDelete.owner.toString() !== req.user?._id) {
      throw new Error(ErrorMessage.ACCESS_DENIED);
    }

    const deletedCard = await Card.findByIdAndRemove(cardId).orFail();

    return res.status(HttpStatusCode.OK).send(deletedCard);
  } catch (err) {
    return next(err);
  }
};

export const updateCardLikes = async (req: RequestCustom, res: Response, next: NextFunction, updateParam: 'add' | 'pull') => {
  try {
    const { cardId } = req.params;

    const likedCard = await Card.findByIdAndUpdate(
      cardId,
      updateParam === 'add'
        ? { $addToSet: { likes: req.user?._id } }
        : { $pull: { likes: req.user?._id } as any },
      { new: true },
    ).orFail();

    return res.status(HttpStatusCode.OK).send(likedCard);
  } catch (err) {
    return next(err);
  }
};

export const likeCard = async (req: RequestCustom, res: Response, next: NextFunction) => updateCardLikes(req, res, next, 'add');

export const dislikeCard = async (req: RequestCustom, res: Response, next: NextFunction) => updateCardLikes(req, res, next, 'pull');
