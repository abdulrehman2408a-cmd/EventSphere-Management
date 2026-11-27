import mongoose from 'mongoose';

const expoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide expo title'],
      trim: true
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide expo description']
    },
    theme: {
      type: String,
      default: 'Innovations for Tomorrow'
    },
    category: {
      type: String,
      required: [true, 'Please specify category'],
      default: 'Technology'
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    },
    dates: {
      type: String,
      default: 'Upcoming 2026'
    },
    venue: {
      type: String,
      required: [true, 'Please provide venue']
    },
    city: {
      type: String,
      required: [true, 'Please provide city'],
      default: 'Karachi'
    },
    country: {
      type: String,
      default: 'Pakistan'
    },
    maxCapacity: {
      type: Number,
      default: 5000
    },
    registeredAttendees: {
      type: Number,
      default: 0
    },
    totalBooths: {
      type: Number,
      default: 80
    },
    bookedBooths: {
      type: Number,
      default: 0
    },
    ticketPricePKR: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Completed'],
      default: 'Published'
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1200'
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Auto-generate slug before save
expoSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

export default mongoose.model('Expo', expoSchema);
