import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    exhibitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exhibitor'
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    expo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expo',
      required: [true, 'Application must be submitted for an Expo']
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    contactPerson: {
      type: String,
      required: [true, 'Contact person name is required']
    },
    email: {
      type: String,
      required: [true, 'Contact email is required'],
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Contact phone is required']
    },
    requestedBoothCategory: {
      type: String,
      default: 'Standard Booth'
    },
    preferredBoothNumber: {
      type: String,
      default: ''
    },
    proposedProductShowcase: {
      type: String,
      default: ''
    },
    requiredPowerKW: {
      type: Number,
      default: 5
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    },
    adminNotes: {
      type: String,
      default: ''
    },
    submittedDate: {
      type: Date,
      default: Date.now
    },
    reviewDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Application', applicationSchema);
