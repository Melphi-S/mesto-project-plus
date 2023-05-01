import mongoose, { Schema } from 'mongoose';
import { validLinkRegexp } from '../utils/constants';

interface ICard {
  name: string,
  link: string,
  owner: Schema.Types.ObjectId,
  likes: Schema.Types.ObjectId[],
  createdAt: Date
}

const cardSchema = new Schema<ICard>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(link: string) {
        return validLinkRegexp.test(link);
      },
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  likes: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
      }],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ICard>('card', cardSchema);
