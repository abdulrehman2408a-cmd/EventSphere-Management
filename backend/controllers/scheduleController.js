import Schedule from '../models/Schedule.js';
import { emitBroadcast } from '../services/socketService.js';

// @desc    Get all schedule sessions
// @route   GET /api/schedule
// @access  Public
export const getSessions = async (req, res, next) => {
  try {
    const { expoId, date, category, search } = req.query;
    const filter = {};

    if (expoId) filter.expo = expoId;
    if (date) filter.date = date;
    if (category && category !== 'All') filter.category = category;
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { speaker: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { hall: new RegExp(search, 'i') }
      ];
    }

    const sessions = await Schedule.find(filter)
      .populate('expo', 'title dates city')
      .sort({ date: 1, time: 1 });

    res.json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single session details
// @route   GET /api/schedule/:id
// @access  Public
export const getSessionById = async (req, res, next) => {
  try {
    const session = await Schedule.findById(req.params.id).populate('expo');
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }
    res.json({ success: true, data: session });
  } catch (error) {
    next(error);
  }
};

// @desc    Create session (Admin)
// @route   POST /api/schedule
// @access  Private (Admin only)
export const createSession = async (req, res, next) => {
  try {
    const session = await Schedule.create(req.body);

    emitBroadcast('schedule_updated', {
      action: 'created',
      session
    });

    res.status(201).json({
      success: true,
      message: 'Session scheduled successfully',
      data: session
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update session (Admin)
// @route   PUT /api/schedule/:id
// @access  Private (Admin only)
export const updateSession = async (req, res, next) => {
  try {
    const session = await Schedule.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    emitBroadcast('schedule_updated', {
      action: 'updated',
      session
    });

    res.json({
      success: true,
      message: 'Session updated successfully',
      data: session
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete session (Admin)
// @route   DELETE /api/schedule/:id
// @access  Private (Admin only)
export const deleteSession = async (req, res, next) => {
  try {
    const session = await Schedule.findByIdAndDelete(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    emitBroadcast('schedule_updated', {
      action: 'deleted',
      sessionId: req.params.id
    });

    res.json({
      success: true,
      message: 'Session removed from schedule'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Enroll / Register for a session (Attendee)
// @route   POST /api/schedule/:id/enroll
// @access  Private
export const enrollSession = async (req, res, next) => {
  try {
    const session = await Schedule.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    if (session.enrolled >= session.maxCapacity) {
      return res.status(400).json({ success: false, message: 'Session has reached maximum capacity' });
    }

    session.enrolled += 1;
    await session.save();

    res.json({
      success: true,
      message: `Enrolled in session: ${session.title}`,
      data: session
    });
  } catch (error) {
    next(error);
  }
};
