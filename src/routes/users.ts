import { Router } from 'express';
import {createUser, getUser, getUsers, patchAvatar, patchUser} from '../controllers/users';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUser);
userRouter.post('/', createUser);
userRouter.patch('/me', patchUser);
userRouter.patch('/me/avatar', patchAvatar);

export default userRouter;
