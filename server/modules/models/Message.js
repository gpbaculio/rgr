import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  text: {
    type: String
  },
  seen: {
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
  collection: 'message'
});

export default mongoose.model('Message', MessageSchema)