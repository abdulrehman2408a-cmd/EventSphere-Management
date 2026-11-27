import Feedback from '../models/Feedback.js';

// @desc    Get all feedback / reviews
// @route   GET /api/feedback
// @access  Public
export const getFeedback = async (req, res, next) => {
  try {
    const { rating, expoTitle } = req.query;
    const filter = {};

    if (rating) filter.rating = Number(rating);
    if (expoTitle) filter.expoTitle = new RegExp(expoTitle, 'i');

    const feedback = await Feedback.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: feedback.length,
      data: feedback
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit feedback or rating
// @route   POST /api/feedback
// @access  Public (or Private)
export const submitFeedback = async (req, res, next) => {
  try {
    const { name, role, rating, expoTitle, comment } = req.body;

    if (!comment) {
      return res.status(400).json({ success: false, message: 'Comment feedback is required' });
    }

    const reviewerName = req.user ? req.user.name : name || 'Attendee';
    const reviewerRole = req.user
      ? req.user.role.charAt(0).toUpperCase() + req.user.role.slice(1)
      : role || 'Attendee';

    const feedback = await Feedback.create({
      user: req.user ? req.user._id : null,
      name: reviewerName,
      role: reviewerRole,
      rating: Number(rating) || 5,
      expoTitle: expoTitle || 'General Event',
      comment,
      date: new Date().toISOString().split('T')[0]
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your valuable feedback!',
      data: feedback
    });
  } catch (error) {
    next(error);
  }
};
