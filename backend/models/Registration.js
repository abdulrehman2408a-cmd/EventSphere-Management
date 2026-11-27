import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    expo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expo',
      required: [true, 'Registration must be linked to an Expo']
    },
    expoTitle: {
      type: String,
      default: 'Expo Event'
    },
    ticketNumber: {
      type: String,
      required: true,
      unique: true
    },
    ticketType: {
      type: String,
      default: 'Standard Pass'
    },
    attendeeName: {
      type: String,
      required: [true, 'Attendee name is required']
    },
    email: {
      type: String,
      required: [true, 'Attendee email is required'],
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      default: '+92 300 0000000'
    },
    company: {
      type: String,
      default: 'Independent Visitor'
    },
    designation: {
      type: String,
      default: 'Delegate'
    },
    city: {
      type: String,
      default: 'Karachi'
    },
    registrationDate: {
      type: Date,
      default: Date.now
    },
    checkedIn: {
      type: Boolean,
      default: false
    },
    checkInTime: {
      type: Date
    },
    paidAmountPKR: {
      type: Number,
      default: 0
    },
    qrCodeData: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Auto generate ticketNumber and qrCodeData if not present
registrationSchema.pre('save', function (next) {
  if (!this.ticketNumber) {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    this.ticketNumber = `ESP-${new Date().getFullYear()}-${randomDigits}`;
  }
  if (!this.qrCodeData) {
    this.qrCodeData = JSON.stringify({
      ticketNumber: this.ticketNumber,
      attendee: this.attendeeName,
      expo: this.expoTitle,
      valid: true
    });
  }
  next();
});

export default mongoose.model('Registration', registrationSchema);
