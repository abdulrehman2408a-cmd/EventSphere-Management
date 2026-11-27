import mongoose from 'mongoose';

const boothSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: [true, 'Please provide booth number'],
      trim: true
    },
    expo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expo',
      required: [true, 'Booth must be linked to an Expo']
    },
    hall: {
      type: String,
      default: 'Hall 1'
    },
    size: {
      type: String,
      default: '6x6m (36 sqm)'
    },
    category: {
      type: String,
      enum: ['Premium Island', 'Corner Booth', 'Standard Booth', 'Startup Pod'],
      default: 'Standard Booth'
    },
    pricePKR: {
      type: Number,
      required: true,
      default: 250000
    },
    status: {
      type: String,
      enum: ['Available', 'Booked', 'Reserved'],
      default: 'Available'
    },
    exhibitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exhibitor',
      default: null
    },
    exhibitorName: {
      type: String,
      default: null
    },
    reservedUntil: {
      type: Date
    },
    coordinates: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
      width: { type: Number, default: 60 },
      height: { type: Number, default: 60 }
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate booth numbers in the same expo
boothSchema.index({ expo: 1, number: 1 }, { unique: true });

export default mongoose.model('Booth', boothSchema);
