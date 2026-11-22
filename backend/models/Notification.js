import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['all', 'admin', 'exhibitor', 'attendee'],
      default: 'all'
    },
    title: {
      type: String,
      required: [true, 'Notification title is required']
    },
    message: {
      type: String,
      required: [true, 'Notification message is required']
    },
    time: {
      type: String,
      default: 'Just now'
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info'
    },
    unread: {
      type: Boolean,
      default: true
    },
    link: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Notification', notificationSchema);
