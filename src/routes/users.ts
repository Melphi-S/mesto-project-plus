import { Router } from 'express';
import {
  createUser, getUser, getUsers, patchUserAvatar, patchUserInfo,
} from '../controllers/users';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUser);
userRouter.post('/', createUser);
userRouter.patch('/me', patchUserInfo);
userRouter.patch('/me/avatar', patchUserAvatar);

export default userRouter;
