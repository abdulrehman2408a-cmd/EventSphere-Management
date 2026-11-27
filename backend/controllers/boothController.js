import Booth from '../models/Booth.js';
import Exhibitor from '../models/Exhibitor.js';
import Expo from '../models/Expo.js';
import { emitBroadcast } from '../services/socketService.js';

// @desc    Get all booths for an expo or all expos
// @route   GET /api/booths
// @access  Public
export const getBooths = async (req, res, next) => {
  try {
    const { expoId, status, category, hall } = req.query;
    const filter = {};

    if (expoId) filter.expo = expoId;
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (hall) filter.hall = hall;

    const booths = await Booth.find(filter)
      .populate('exhibitor', 'name logo category')
      .sort({ number: 1 });

    res.json({
      success: true,
      count: booths.length,
      data: booths
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booth details
// @route   GET /api/booths/:id
// @access  Public
export const getBoothById = async (req, res, next) => {
  try {
    const booth = await Booth.findById(req.params.id)
      .populate('expo', 'title dates city venue')
      .populate('exhibitor', 'name logo category website email phone');

    if (!booth) {
      return res.status(404).json({ success: false, message: 'Booth not found' });
    }

    res.json({ success: true, data: booth });
  } catch (error) {
    next(error);
  }
};

// @desc    Book / Reserve a booth (with atomic double-booking prevention)
// @route   POST /api/booths/:id/book
// @access  Private (Exhibitor or Admin)
export const bookBooth = async (req, res, next) => {
  try {
    const { id } = req.params;
    let { exhibitorId, exhibitorName } = req.body;

    // If logged in as exhibitor, resolve their exhibitor profile
    if (req.user.role === 'exhibitor' && !exhibitorId) {
      const exhibitor = await Exhibitor.findOne({ user: req.user._id });
      if (!exhibitor) {
        return res.status(400).json({
          success: false,
          message: 'No exhibitor profile found for current user account'
        });
      }
      exhibitorId = exhibitor._id;
      exhibitorName = exhibitor.name;
    }

    // Prevent exhibitor from booking under another company's ID
    if (req.user.role === 'exhibitor' && req.body.exhibitorId) {
      const myExhibitor = await Exhibitor.findOne({ user: req.user._id });
      if (myExhibitor && req.body.exhibitorId !== myExhibitor._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Cannot book a booth for another company'
        });
      }
    }

    if (!exhibitorId || !exhibitorName) {
      return res.status(400).json({
        success: false,
        message: 'Exhibitor ID and company name are required to book a booth'
      });
    }

    // ATOMIC double-booking guard:
    // Only updates if status is currently 'Available'
    const updatedBooth = await Booth.findOneAndUpdate(
      { _id: id, status: 'Available' },
      {
        status: 'Booked',
        exhibitor: exhibitorId,
        exhibitorName: exhibitorName
      },
      { new: true }
    );

    if (!updatedBooth) {
      // Check whether booth exists or was already booked
      const existing = await Booth.findById(id);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Booth not found' });
      }
      return res.status(409).json({
        success: false,
        message: `Booth ${existing.number} is already booked or reserved by another exhibitor.`
      });
    }

    // Increment bookedBooths count on Expo
    await Expo.findByIdAndUpdate(updatedBooth.expo, { $inc: { bookedBooths: 1 } });

    // Link booth number to Exhibitor document
    await Exhibitor.findByIdAndUpdate(exhibitorId, {
      boothNumber: updatedBooth.number,
      boothSize: updatedBooth.size,
      hall: updatedBooth.hall
    });

    // Real-time broadcast floor plan update
    emitBroadcast('booth_updated', {
      id: updatedBooth._id,
      number: updatedBooth.number,
      status: 'Booked',
      exhibitorId,
      exhibitorName
    });

    res.json({
      success: true,
      message: `Booth ${updatedBooth.number} successfully reserved and booked!`,
      data: updatedBooth
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin manually update booth status or assignment
// @route   PUT /api/booths/:id/status
// @access  Private (Admin only)
export const updateBoothStatus = async (req, res, next) => {
  try {
    const { status, exhibitorId, exhibitorName } = req.body;
    const { id } = req.params;

    const currentBooth = await Booth.findById(id);
    if (!currentBooth) {
      return res.status(404).json({ success: false, message: 'Booth not found' });
    }

    const previousStatus = currentBooth.status;

    currentBooth.status = status || currentBooth.status;
    if (status === 'Available') {
      currentBooth.exhibitor = null;
      currentBooth.exhibitorName = null;
    } else {
      if (exhibitorId) currentBooth.exhibitor = exhibitorId;
      if (exhibitorName) currentBooth.exhibitorName = exhibitorName;
    }

    await currentBooth.save();

    // Adjust Expo counts if status changed
    if (previousStatus === 'Available' && status === 'Booked') {
      await Expo.findByIdAndUpdate(currentBooth.expo, { $inc: { bookedBooths: 1 } });
    } else if (previousStatus === 'Booked' && status === 'Available') {
      await Expo.findByIdAndUpdate(currentBooth.expo, { $inc: { bookedBooths: -1 } });
    }

    emitBroadcast('booth_updated', {
      id: currentBooth._id,
      number: currentBooth.number,
      status: currentBooth.status,
      exhibitorId: currentBooth.exhibitor,
      exhibitorName: currentBooth.exhibitorName
    });

    res.json({
      success: true,
      message: `Booth ${currentBooth.number} updated to ${currentBooth.status}`,
      data: currentBooth
    });
  } catch (error) {
    next(error);
  }
};
