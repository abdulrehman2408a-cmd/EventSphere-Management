import crypto from 'crypto';
import User from '../models/User.js';
import Exhibitor from '../models/Exhibitor.js';
import { generateToken } from '../utils/generateToken.js';
import { sendPasswordResetEmail } from '../services/emailService.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, organization, phone, city, title } = req.body;

    // Security: Block any attempt to register with admin privileges via public endpoint
    if (role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin registration is restricted. Administrator accounts cannot be created via public registration.'
      });
    }

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, and password'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists'
      });
    }

    const assignedRole = role === 'exhibitor' ? 'exhibitor' : 'attendee';

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: assignedRole,
      organization: organization || (assignedRole === 'exhibitor' ? `${name} Enterprise` : 'Independent'),
      phone: phone || '',
      city: city || 'Karachi',
      title: title || (assignedRole === 'admin' ? 'Event Director' : assignedRole === 'exhibitor' ? 'Managing Partner' : 'Delegate')
    });

    // If role is exhibitor, initialize their company profile
    if (assignedRole === 'exhibitor') {
      const exhibitor = await Exhibitor.create({
        name: organization || `${name} Technologies`,
        user: user._id,
        email: user.email,
        phone: user.phone,
        city: user.city,
        description: `${organization || name} is an innovative solutions provider participating in premier industry expos.`,
        category: 'Software & Cloud'
      });
      user.exhibitorProfile = exhibitor._id;
      await user.save();
    }

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        title: user.title,
        organization: user.organization,
        phone: user.phone,
        city: user.city,
        avatar: user.avatar,
        exhibitorProfile: user.exhibitorProfile
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        title: user.title,
        organization: user.organization,
        phone: user.phone,
        city: user.city,
        avatar: user.avatar,
        exhibitorProfile: user.exhibitorProfile
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently logged in user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('exhibitorProfile');
    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile fields
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'title', 'organization', 'phone', 'city', 'avatar'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password - generate reset token & dispatch
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide email address' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Return 200 for security so attackers can't enumerate emails
      return res.json({
        success: true,
        message: 'If that email exists in our system, recovery instructions have been sent.'
      });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour

    await user.save({ validateBeforeSave: false });

    await sendPasswordResetEmail(user.email, resetToken, req.headers.host);

    res.json({
      success: true,
      message: 'Password reset instructions have been dispatched to your email.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password using valid token
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token'
      });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const authToken = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Password updated successfully! You are now logged in.',
      token: authToken
    });
  } catch (error) {
    next(error);
  }
};
