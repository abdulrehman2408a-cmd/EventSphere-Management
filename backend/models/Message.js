import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    senderName: {
      type: String,
      default: 'Visitor'
    },
    senderEmail: {
      type: String,
      default: ''
    },
    senderRole: {
      type: String,
      default: 'attendee'
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    recipientRole: {
      type: String,
      default: 'admin'
    },
    exhibitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exhibitor'
    },
    expo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expo'
    },
    to: {
      type: String,
      default: 'Organizer Support'
    },
    from: {
      type: String,
      default: 'Visitor'
    },
    subject: {
      type: String,
      default: 'Inquiry'
    },
    content: {
      type: String,
      required: [true, 'Message content is required']
    },
    time: {
      type: String,
      default: 'Just now'
    },
    status: {
      type: String,
      enum: ['Open', 'Replied', 'Closed'],
      default: 'Open'
    },
    replies: [
      {
        sender: { type: String, required: true },
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: { type: String, required: true },
        time: { type: String, default: 'Just now' },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Message', messageSchema);
