import mongoose, {Schema} from 'mongoose';

const TodoSchema = new Schema({
  text: {
    type: String
  },
  complete: {
    type: Boolean
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  },
  collection: 'todo'
});

export const Todo = mongoose.model('Todo', TodoSchema)