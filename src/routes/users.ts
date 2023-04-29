import { Router } from 'express';
import {
  getUser, getUsers, patchUserAvatar, patchUserInfo,
} from '../controllers/users';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUser);
userRouter.patch('/me', patchUserInfo);
userRouter.patch('/me/avatar', patchUserAvatar);

export default userRouter;
