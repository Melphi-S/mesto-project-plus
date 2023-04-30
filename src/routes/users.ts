import { Router } from 'express';
import {
  getUser, getUsers, patchUserAvatar, patchUserInfo,
} from '../controllers/users';
import { idValidation, patchUserAvatarValidation, patchUserInfoValidation } from '../validation';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/me', getUser);
userRouter.get('/:userId', idValidation('userId'), getUser);
userRouter.patch('/me', patchUserInfoValidation, patchUserInfo);
userRouter.patch('/me/avatar', patchUserAvatarValidation, patchUserAvatar);

export default userRouter;
