import { Router } from 'express';
import { createUserValidation, loginValidation } from '../validation';
import { createUser, login } from '../controllers/users';

const rootRouter = Router();

rootRouter.post('/signin', loginValidation, login);
rootRouter.post('/signup', createUserValidation, createUser);

export default rootRouter;
