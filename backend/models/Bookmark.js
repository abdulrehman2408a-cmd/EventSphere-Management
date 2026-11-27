import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Bookmark must belong to a user']
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Schedule',
      required: [true, 'Bookmark must reference a session']
    }
  },
  {
    timestamps: true
  }
);

bookmarkSchema.index({ user: 1, session: 1 }, { unique: true });

export default mongoose.model('Bookmark', bookmarkSchema);
