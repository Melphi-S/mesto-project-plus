import { Router, Request, Response } from 'express';
import userRouter from './users';
import cardRouter from './cards';
import { ErrorMessage } from '../types/ErrorMessage';

const router = Router();

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', (req: Request, res: Response) => {
  res.status(404).send({ message: ErrorMessage.PAGE_NOT_FOUND });
});

export default router;
