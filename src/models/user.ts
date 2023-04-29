import mongoose, { Schema, Model } from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import bcrypt from 'bcryptjs';

export interface IUser {
  name: string,
  about: string,
  avatar: string,
  email: string,
  password: string,
  _id: string,
}

export interface IUserModel extends Model<IUser> {
  // eslint-disable-next-line no-unused-vars
  findUserByCredentials(email: string, password: string): IUser,
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: isEmail,
    },
  },
  password: {
    type: String,
    required: true,
  },
}, {
  statics: {
    async findUserByCredentials(email: string, password: string) {
      const user = await this.findOne({ email }).orFail();
      const isAuthorized = await bcrypt.compare(password, user.password);
      if (!isAuthorized) {
        throw new Error();
      }
      return user;
    },
  },
});

export default mongoose.model<IUser, IUserModel>('user', userSchema);
