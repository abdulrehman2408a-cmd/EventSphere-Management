import Application from '../models/Application.js';
import Exhibitor from '../models/Exhibitor.js';
import Notification from '../models/Notification.js';
import { emitToUser } from '../services/socketService.js';

// @desc    Apply for Expo space (Exhibitor)
// @route   POST /api/applications
// @access  Private (Exhibitor)
export const applyForExpo = async (req, res, next) => {
  try {
    const {
      expoId,
      companyName,
      contactPerson,
      email,
      phone,
      requestedBoothCategory,
      preferredBoothNumber,
      proposedProductShowcase,
      requiredPowerKW
    } = req.body;

    if (!expoId || !companyName || !contactPerson || !email) {
      return res.status(400).json({
        success: false,
        message: 'Expo ID, company name, contact person, and email are required'
      });
    }

    let exhibitor = await Exhibitor.findOne({ user: req.user._id });
    if (!exhibitor) {
      exhibitor = await Exhibitor.create({
        name: companyName,
        user: req.user._id,
        email,
        phone,
        status: 'Pending'
      });
    }

    const application = await Application.create({
      exhibitor: exhibitor._id,
      user: req.user._id,
      expo: expoId,
      companyName,
      contactPerson,
      email,
      phone,
      requestedBoothCategory: requestedBoothCategory || 'Standard Booth',
      preferredBoothNumber: preferredBoothNumber || '',
      proposedProductShowcase: proposedProductShowcase || '',
      requiredPowerKW: Number(requiredPowerKW) || 5,
      status: 'Pending'
    });

    res.status(201).json({
      success: true,
      message: 'Expo exhibition application submitted successfully. Organizers will review shortly.',
      data: application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my applications
// @route   GET /api/applications/my
// @access  Private (Exhibitor)
export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ user: req.user._id })
      .populate('expo', 'title dates venue city coverImage')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications (Admin)
// @route   GET /api/applications
// @access  Private (Admin only)
export const getAllApplications = async (req, res, next) => {
  try {
    const { status, expoId } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (expoId) filter.expo = expoId;

    const applications = await Application.find(filter)
      .populate('expo', 'title dates city')
      .populate('user', 'name email organization phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (Admin)
// @route   PATCH /api/applications/:id/status
// @access  Private (Admin only)
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;

    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid application status' });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    application.status = status;
    if (adminNotes !== undefined) application.adminNotes = adminNotes;
    application.reviewDate = new Date();
    await application.save();

    // If approved, update exhibitor status
    if (application.exhibitor) {
      await Exhibitor.findByIdAndUpdate(application.exhibitor, {
        status: status === 'Approved' ? 'Approved' : 'Rejected'
      });
    }

    // Send notification to exhibitor user
    if (application.user) {
      const notif = await Notification.create({
        user: application.user,
        role: 'exhibitor',
        title: `Application ${status}!`,
        message: `Your expo application for ${application.companyName} has been ${status.toLowerCase()}. ${adminNotes ? `Note: ${adminNotes}` : ''}`,
        type: status === 'Approved' ? 'success' : 'error',
        link: '/exhibitor/applications'
      });
      emitToUser(application.user, 'new_notification', notif);
    }

    res.json({
      success: true,
      message: `Application marked as ${status}`,
      data: application
    });
  } catch (error) {
    next(error);
  }
};
