import Bookmark from '../models/Bookmark.js';

// @desc    Get bookmarked sessions for logged-in user
// @route   GET /api/bookmarks
// @access  Private
export const getMyBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id })
      .populate({
        path: 'session',
        populate: { path: 'expo', select: 'title city dates' }
      })
      .sort({ createdAt: -1 });

    const sessionIds = bookmarks.map((b) => b.session?._id || b.session);

    res.json({
      success: true,
      count: bookmarks.length,
      sessionIds,
      data: bookmarks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle bookmark on a session
// @route   POST /api/bookmarks/:sessionId
// @access  Private
export const toggleBookmark = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const existing = await Bookmark.findOne({
      user: req.user._id,
      session: sessionId
    });

    if (existing) {
      await Bookmark.findByIdAndDelete(existing._id);
      const remaining = await Bookmark.find({ user: req.user._id }).select('session');
      return res.json({
        success: true,
        bookmarked: false,
        message: 'Session removed from personal schedule',
        sessionIds: remaining.map((b) => b.session)
      });
    } else {
      await Bookmark.create({
        user: req.user._id,
        session: sessionId
      });
      const all = await Bookmark.find({ user: req.user._id }).select('session');
      return res.json({
        success: true,
        bookmarked: true,
        message: 'Session added to your personal schedule!',
        sessionIds: all.map((b) => b.session)
      });
    }
  } catch (error) {
    next(error);
  }
};
