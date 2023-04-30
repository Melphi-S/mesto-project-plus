import { Router } from 'express';
import {
  createCard,
  deleteCard,
  dislikeCard,
  getCards,
  likeCard,
} from '../controllers/cards';
import { createCardValidation, idValidation } from '../validation';

const cardRouter = Router();

cardRouter.get('/', getCards);
cardRouter.post('/', createCardValidation, createCard);
cardRouter.delete('/:cardId', idValidation('cardId'), deleteCard);
cardRouter.put('/:cardId/likes', idValidation('cardId'), likeCard);
cardRouter.delete('/:cardId/likes', idValidation('cardId'), dislikeCard);

export default cardRouter;
