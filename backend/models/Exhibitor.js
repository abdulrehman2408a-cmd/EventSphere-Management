import mongoose from 'mongoose';

const exhibitorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide company name'],
      trim: true
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    expo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expo'
    },
    category: {
      type: String,
      default: 'Software & Cloud'
    },
    description: {
      type: String,
      default: 'Enterprise technology innovator and exhibition partner.'
    },
    logo: {
      type: String,
      default: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200'
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1200'
    },
    boothNumber: {
      type: String,
      default: 'Pending Assignment'
    },
    boothSize: {
      type: String,
      default: '6x6m (36 sqm)'
    },
    hall: {
      type: String,
      default: 'Hall 1'
    },
    website: {
      type: String,
      default: 'https://eventsphere.pk'
    },
    email: {
      type: String,
      default: 'contact@company.com'
    },
    phone: {
      type: String,
      default: '+92 21 3500 0000'
    },
    city: {
      type: String,
      default: 'Karachi'
    },
    country: {
      type: String,
      default: 'Pakistan'
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Approved'
    },
    featured: {
      type: Boolean,
      default: false
    },
    rating: {
      type: Number,
      default: 4.8
    },
    reviewsCount: {
      type: Number,
      default: 16
    },
    products: [
      {
        name: { type: String, required: true },
        category: { type: String, default: 'Solutions' },
        description: { type: String, default: '' },
        image: { type: String, default: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600' },
        price: { type: String, default: 'Inquire at Booth' }
      }
    ],
    staff: [
      {
        name: { type: String, required: true },
        role: { type: String, default: 'Booth Representative' },
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
        badgeIssued: { type: Boolean, default: true }
      }
    ],
    documents: [
      {
        title: { type: String, required: true },
        url: { type: String, required: true },
        uploadDate: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true
  }
);

exhibitorSchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

export default mongoose.model('Exhibitor', exhibitorSchema);
