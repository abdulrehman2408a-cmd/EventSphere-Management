import Exhibitor from '../models/Exhibitor.js';
import Notification from '../models/Notification.js';
import { emitToUser, emitBroadcast } from '../services/socketService.js';

// @desc    Get all exhibitors
// @route   GET /api/exhibitors
// @access  Public
export const getAllExhibitors = async (req, res, next) => {
  try {
    const { category, city, status, search, featured } = req.query;
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
    if (featured === 'true') {
      filter.featured = true;
    }
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { boothNumber: new RegExp(search, 'i') }
      ];
    }

    const exhibitors = await Exhibitor.find(filter)
      .populate('expo', 'title dates city')
      .sort({ featured: -1, rating: -1, createdAt: -1 });

    res.json({
      success: true,
      count: exhibitors.length,
      data: exhibitors
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single exhibitor by ID or Slug
// @route   GET /api/exhibitors/:id
// @access  Public
export const getExhibitorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let exhibitor;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      exhibitor = await Exhibitor.findById(id).populate('expo', 'title dates venue city');
    } else {
      exhibitor = await Exhibitor.findOne({ slug: id }).populate('expo', 'title dates venue city');
    }

    if (!exhibitor) {
      return res.status(404).json({
        success: false,
        message: 'Exhibitor profile not found'
      });
    }

    res.json({
      success: true,
      data: exhibitor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update exhibitor profile
// @route   PUT /api/exhibitors/:id
// @access  Private (Exhibitor owner or Admin)
export const updateExhibitorProfile = async (req, res, next) => {
  try {
    let exhibitor = await Exhibitor.findById(req.params.id);
    if (!exhibitor) {
      return res.status(404).json({ success: false, message: 'Exhibitor profile not found' });
    }

    // Authorization check: User must own the profile or be an admin
    if (
      req.user.role !== 'admin' &&
      (!exhibitor.user || exhibitor.user.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this exhibitor profile'
      });
    }

    exhibitor = await Exhibitor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Company profile updated successfully',
      data: exhibitor
    });
  } catch (error) {
    next(error);
  }
};

// Helper to verify exhibitor ownership
const verifyExhibitorOwnership = (exhibitor, req) => {
  if (req.user.role === 'admin') return true;
  return exhibitor.user && exhibitor.user.toString() === req.user._id.toString();
};

// @desc    Add product/service to showcase
// @route   POST /api/exhibitors/:id/products
// @access  Private (Exhibitor owner or Admin)
export const addProduct = async (req, res, next) => {
  try {
    const exhibitor = await Exhibitor.findById(req.params.id);
    if (!exhibitor) {
      return res.status(404).json({ success: false, message: 'Exhibitor not found' });
    }

    if (!verifyExhibitorOwnership(exhibitor, req)) {
      return res.status(403).json({ success: false, message: 'Not authorized to manage products for this company' });
    }

    exhibitor.products.push(req.body);
    await exhibitor.save();

    res.status(201).json({
      success: true,
      message: 'Product added to showcase successfully',
      data: exhibitor.products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product/service from showcase
// @route   DELETE /api/exhibitors/:id/products/:productId
// @access  Private (Exhibitor owner or Admin)
export const removeProduct = async (req, res, next) => {
  try {
    const exhibitor = await Exhibitor.findById(req.params.id);
    if (!exhibitor) {
      return res.status(404).json({ success: false, message: 'Exhibitor not found' });
    }

    if (!verifyExhibitorOwnership(exhibitor, req)) {
      return res.status(403).json({ success: false, message: 'Not authorized to manage products for this company' });
    }

    exhibitor.products = exhibitor.products.filter(
      (p) => p._id.toString() !== req.params.productId
    );
    await exhibitor.save();

    res.json({
      success: true,
      message: 'Product removed from showcase',
      data: exhibitor.products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add staff member to exhibitor
// @route   POST /api/exhibitors/:id/staff
// @access  Private (Exhibitor owner or Admin)
export const addStaff = async (req, res, next) => {
  try {
    const exhibitor = await Exhibitor.findById(req.params.id);
    if (!exhibitor) {
      return res.status(404).json({ success: false, message: 'Exhibitor not found' });
    }

    if (!verifyExhibitorOwnership(exhibitor, req)) {
      return res.status(403).json({ success: false, message: 'Not authorized to manage staff for this company' });
    }

    const staffMember = {
      ...req.body,
      badgeIssued: true
    };

    exhibitor.staff.push(staffMember);
    await exhibitor.save();

    res.status(201).json({
      success: true,
      message: 'Booth staff pass issued',
      data: exhibitor.staff
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove staff member
// @route   DELETE /api/exhibitors/:id/staff/:staffId
// @access  Private (Exhibitor owner or Admin)
export const removeStaff = async (req, res, next) => {
  try {
    const exhibitor = await Exhibitor.findById(req.params.id);
    if (!exhibitor) {
      return res.status(404).json({ success: false, message: 'Exhibitor not found' });
    }

    if (!verifyExhibitorOwnership(exhibitor, req)) {
      return res.status(403).json({ success: false, message: 'Not authorized to manage staff for this company' });
    }

    exhibitor.staff = exhibitor.staff.filter((s) => s._id.toString() !== req.params.staffId);
    await exhibitor.save();

    res.json({
      success: true,
      message: 'Staff pass revoked',
      data: exhibitor.staff
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload company logo or document
// @route   POST /api/exhibitors/:id/upload
// @access  Private (Exhibitor owner or Admin)
export const uploadExhibitorAsset = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const { type } = req.body; // 'logo' or 'document'

    const exhibitor = await Exhibitor.findById(req.params.id);
    if (!exhibitor) {
      return res.status(404).json({ success: false, message: 'Exhibitor not found' });
    }

    if (!verifyExhibitorOwnership(exhibitor, req)) {
      return res.status(403).json({ success: false, message: 'Not authorized to upload files for this company' });
    }

    if (type === 'logo') {
      exhibitor.logo = fileUrl;
    } else {
      exhibitor.documents.push({
        title: req.body.title || req.file.originalname,
        url: fileUrl
      });
    }

    await exhibitor.save();

    res.json({
      success: true,
      message: 'File uploaded successfully',
      fileUrl,
      data: exhibitor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin approve exhibitor
// @route   PATCH /api/exhibitors/:id/approve
// @access  Private (Admin only)
export const approveExhibitor = async (req, res, next) => {
  try {
    const exhibitor = await Exhibitor.findByIdAndUpdate(
      req.params.id,
      { status: 'Approved' },
      { new: true }
    );

    if (!exhibitor) {
      return res.status(404).json({ success: false, message: 'Exhibitor not found' });
    }

    // Send notification to exhibitor user
    if (exhibitor.user) {
      const notif = await Notification.create({
        user: exhibitor.user,
        role: 'exhibitor',
        title: 'Application Approved!',
        message: `Your company ${exhibitor.name} has been approved for exhibition access.`,
        type: 'success',
        link: '/exhibitor/booths'
      });
      emitToUser(exhibitor.user, 'new_notification', notif);
    }

    res.json({
      success: true,
      message: 'Exhibitor approved successfully',
      data: exhibitor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin reject exhibitor
// @route   PATCH /api/exhibitors/:id/reject
// @access  Private (Admin only)
export const rejectExhibitor = async (req, res, next) => {
  try {
    const exhibitor = await Exhibitor.findByIdAndUpdate(
      req.params.id,
      { status: 'Rejected' },
      { new: true }
    );

    if (!exhibitor) {
      return res.status(404).json({ success: false, message: 'Exhibitor not found' });
    }

    res.json({
      success: true,
      message: 'Exhibitor rejected',
      data: exhibitor
    });
  } catch (error) {
    next(error);
  }
};
