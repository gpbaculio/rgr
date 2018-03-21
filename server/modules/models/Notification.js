import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  likerId: { type : mongoose.Schema.Types.ObjectId, ref: 'User' },
  todoId: { type : mongoose.Schema.Types.ObjectId, ref: 'Todo' },
  complete: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  },
  collection: 'notification'
});

export default mongoose.model('Notification', NotificationSchema)