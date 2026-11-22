import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    expo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expo'
    },
    name: {
      type: String,
      required: [true, 'Reviewer name is required']
    },
    role: {
      type: String,
      default: 'Attendee'
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
      default: 5
    },
    expoTitle: {
      type: String,
      default: 'General Expo'
    },
    comment: {
      type: String,
      required: [true, 'Comment is required']
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split('T')[0]
    },
    status: {
      type: String,
      enum: ['Published', 'Pending', 'Archived'],
      default: 'Published'
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Feedback', feedbackSchema);
