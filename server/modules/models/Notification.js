import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  likerId: {
    type: String,
  },
  todoId: {
    type: String,
  },
  seen: {
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