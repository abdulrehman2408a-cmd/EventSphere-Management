import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema(
  {
    expo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expo',
      required: [true, 'Session must belong to an Expo']
    },
    title: {
      type: String,
      required: [true, 'Session title is required'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    speaker: {
      type: String,
      required: [true, 'Speaker name is required']
    },
    speakerRole: {
      type: String,
      default: 'Keynote Speaker'
    },
    speakerCompany: {
      type: String,
      default: 'Enterprise Solutions'
    },
    speakerImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
    },
    date: {
      type: String,
      default: '2026-11-20'
    },
    time: {
      type: String,
      default: '10:00 AM - 11:15 AM'
    },
    hall: {
      type: String,
      default: 'Auditorium Hall A'
    },
    category: {
      type: String,
      default: 'Keynote & AI'
    },
    maxCapacity: {
      type: Number,
      default: 250
    },
    enrolled: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Schedule', scheduleSchema);
