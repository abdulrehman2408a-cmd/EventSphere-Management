import Expo from '../models/Expo.js';
import Booth from '../models/Booth.js';
import Schedule from '../models/Schedule.js';
import { emitBroadcast } from '../services/socketService.js';

// @desc    Get all expos with search and filter
// @route   GET /api/expos
// @access  Public
export const getAllExpos = async (req, res, next) => {
  try {
    const { category, city, status, search } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = new RegExp(category, 'i');
    }
    if (city && city !== 'All') {
      filter.city = new RegExp(city, 'i');
    }
    if (status) {
      filter.status = status;
    }
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { venue: new RegExp(search, 'i') },
        { theme: new RegExp(search, 'i') }
      ];
    }

    const expos = await Expo.find(filter).sort({ startDate: 1, createdAt: -1 });

    res.json({
      success: true,
      count: expos.length,
      data: expos
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single expo by ID or Slug
// @route   GET /api/expos/:id
// @access  Public
export const getExpoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let expo;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      expo = await Expo.findById(id).populate('organizer', 'name email organization');
    } else {
      expo = await Expo.findOne({ slug: id }).populate('organizer', 'name email organization');
    }

    if (!expo) {
      return res.status(404).json({
        success: false,
        message: 'Expo event not found'
      });
    }

    // Attach current counts
    const boothCount = await Booth.countDocuments({ expo: expo._id });
    const bookedBooths = await Booth.countDocuments({ expo: expo._id, status: 'Booked' });
    const sessions = await Schedule.find({ expo: expo._id });

    res.json({
      success: true,
      data: expo,
      stats: {
        boothCount,
        bookedBooths,
        availableBooths: Math.max(0, boothCount - bookedBooths),
        sessionsCount: sessions.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new expo
// @route   POST /api/expos
// @access  Private (Admin only)
export const createExpo = async (req, res, next) => {
  try {
    const expoData = {
      ...req.body,
      organizer: req.user._id
    };

    const expo = await Expo.create(expoData);

    emitBroadcast('expo_created', {
      id: expo._id,
      title: expo.title,
      category: expo.category,
      city: expo.city
    });

    res.status(201).json({
      success: true,
      message: 'New Expo event published successfully',
      data: expo
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update expo
// @route   PUT /api/expos/:id
// @access  Private (Admin only)
export const updateExpo = async (req, res, next) => {
  try {
    const expo = await Expo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!expo) {
      return res.status(404).json({ success: false, message: 'Expo not found' });
    }

    emitBroadcast('expo_updated', { id: expo._id, title: expo.title });

    res.json({
      success: true,
      message: 'Expo updated successfully',
      data: expo
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete expo
// @route   DELETE /api/expos/:id
// @access  Private (Admin only)
export const deleteExpo = async (req, res, next) => {
  try {
    const expo = await Expo.findByIdAndDelete(req.params.id);

    if (!expo) {
      return res.status(404).json({ success: false, message: 'Expo not found' });
    }

    // Clean up associated booths & sessions
    await Booth.deleteMany({ expo: expo._id });
    await Schedule.deleteMany({ expo: expo._id });

    emitBroadcast('expo_deleted', { id: req.params.id });

    res.json({
      success: true,
      message: 'Expo and associated data removed successfully'
    });
  } catch (error) {
    next(error);
  }
};
