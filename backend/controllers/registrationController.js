import Registration from '../models/Registration.js';
import Expo from '../models/Expo.js';
import Notification from '../models/Notification.js';
import { emitToUser } from '../services/socketService.js';

// @desc    Register for an Expo (generate pass)
// @route   POST /api/registrations
// @access  Public (or Private)
export const registerForExpo = async (req, res, next) => {
  try {
    const { expoId, name, email, phone, company, designation, city, ticketType } = req.body;

    if (!expoId || !name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Expo ID, attendee name, and email are required'
      });
    }

    const expo = await Expo.findById(expoId);
    if (!expo) {
      return res.status(404).json({ success: false, message: 'Expo event not found' });
    }

    // Generate unique ticket number
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const ticketNumber = `ESP-${new Date().getFullYear()}-${randomNum}`;

    const qrPayload = JSON.stringify({
      ticketNumber,
      attendee: name,
      expo: expo.title,
      dates: expo.dates,
      venue: expo.venue,
      valid: true
    });

    const registration = await Registration.create({
      user: req.user ? req.user._id : null,
      expo: expo._id,
      expoTitle: expo.title,
      ticketNumber,
      ticketType: ticketType || 'Standard Pass',
      attendeeName: name,
      email: email.toLowerCase(),
      phone: phone || '+92 300 0000000',
      company: company || 'Independent Visitor',
      designation: designation || 'Delegate',
      city: city || expo.city || 'Karachi',
      paidAmountPKR: expo.ticketPricePKR || 0,
      qrCodeData: qrPayload
    });

    // Increment registered attendees count on expo
    await Expo.findByIdAndUpdate(expo._id, { $inc: { registeredAttendees: 1 } });

    // Send notification if user logged in
    if (req.user) {
      const notif = await Notification.create({
        user: req.user._id,
        role: 'attendee',
        title: 'Expo Pass Confirmed!',
        message: `Your badge for ${expo.title} has been generated. Pass ID: ${ticketNumber}`,
        type: 'success',
        link: '/attendee/events'
      });
      emitToUser(req.user._id, 'new_notification', notif);
    }

    res.status(201).json({
      success: true,
      message: `Registration confirmed for ${expo.title}! Digital pass generated.`,
      data: registration
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get registrations of logged-in user
// @route   GET /api/registrations/my
// @access  Private
export const getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({
      $or: [{ user: req.user._id }, { email: req.user.email.toLowerCase() }]
    })
      .populate('expo', 'title dates venue city coverImage status')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registrations (Admin view)
// @route   GET /api/registrations
// @access  Private (Admin only)
export const getAllRegistrations = async (req, res, next) => {
  try {
    const { expoId, search, checkedIn } = req.query;
    const filter = {};

    if (expoId) filter.expo = expoId;
    if (checkedIn !== undefined) filter.checkedIn = checkedIn === 'true';
    if (search) {
      filter.$or = [
        { attendeeName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { ticketNumber: new RegExp(search, 'i') },
        { company: new RegExp(search, 'i') }
      ];
    }

    const registrations = await Registration.find(filter)
      .populate('expo', 'title dates city venue')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle check-in status (Admin entrance scanner)
// @route   PATCH /api/registrations/:id/checkin
// @access  Private (Admin only)
export const toggleCheckIn = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration record not found' });
    }

    registration.checkedIn = !registration.checkedIn;
    registration.checkInTime = registration.checkedIn ? new Date() : null;
    await registration.save();

    res.json({
      success: true,
      message: registration.checkedIn
        ? `Check-in confirmed for ${registration.attendeeName}`
        : `Check-in status reversed for ${registration.attendeeName}`,
      data: registration
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single registration pass
// @route   GET /api/registrations/:id
// @access  Private
export const getRegistrationById = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id).populate('expo');
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Pass not found' });
    }

    // Authentication required
    if (!req.user) {
      return res.status(403).json({ success: false, message: 'Authentication required to view ticket details' });
    }

    // Ownership check: admin can view any, others only their own
    if (req.user.role !== 'admin') {
      const isOwner =
        registration.user?.toString() === req.user._id.toString() ||
        registration.email === req.user.email.toLowerCase();
      if (!isOwner) {
        return res.status(403).json({ success: false, message: 'Access denied: you can only view your own registration passes.' });
      }
    }

    res.json({ success: true, data: registration });
  } catch (error) {
    next(error);
  }
};
