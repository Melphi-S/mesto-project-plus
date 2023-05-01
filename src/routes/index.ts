import {
  Router, Request, Response, NextFunction,
} from 'express';
import userRouter from './users';
import cardRouter from './cards';
import ErrorMessage from '../types/ErrorMessage';
import NotFoundError from '../errors/NotFoundError';

const router = Router();

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError(ErrorMessage.PAGE_NOT_FOUND));
});

export default router;
