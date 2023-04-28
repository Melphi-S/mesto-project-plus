import { Request, Response } from 'express';
import Card from '../models/card';
import HttpStatusCode from '../types/HttpStatusCode';
import { RequestCustom } from '../types';
import { catchError } from '../errors/errors';

export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);

    return res.status(HttpStatusCode.OK).send(cards);
  } catch (e) {
    return catchError(e, res);
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
    return catchError(e, res);
  }
};

export const deleteCard = async (req: RequestCustom, res: Response) => {
  try {
    const { cardId } = req.params;
    const deletedCard = await Card.findByIdAndDelete(cardId).orFail();

    return res.status(HttpStatusCode.OK).send(deletedCard);
  } catch (e) {
    return catchError(e, res);
  }
};

export const updateCardLikes = async (req: RequestCustom, res: Response, updateParam: 'add' | 'pull') => {
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
  } catch (e) {
    return catchError(e, res);
  }
};

export const likeCard = async (req: RequestCustom, res: Response) => updateCardLikes(req, res, 'add');

export const dislikeCard = async (req: RequestCustom, res: Response) => updateCardLikes(req, res, 'pull');
