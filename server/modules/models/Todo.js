import mongoose from 'mongoose';

const TodoSchema = new mongoose.Schema({
  text: {
    type: String
  },
  complete: {
    type: Boolean
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  },
  collection: 'todo'
});

export default mongoose.model('Todo', TodoSchema)