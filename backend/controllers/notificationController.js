import Notification from '../models/Notification.js';

// @desc    Get notifications for user
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res, next) => {
  try {
    const role = req.user.role;
    const userId = req.user._id;

    const notifications = await Notification.find({
      $or: [{ role: 'all' }, { role: role }, { user: userId }]
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark single notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    // Ownership check
    const userId = req.user._id.toString();
    const isPersonal = notification.user?.toString() === userId;
    const isRoleBased = notification.role === 'all' || notification.role === req.user.role;
    if (!isPersonal && !isRoleBased && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied: cannot modify another user\'s notification' });
    }

    notification.unread = false;
    await notification.save();

    res.json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read for current user/role
// @route   PATCH /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req, res, next) => {
  try {
    const role = req.user.role;
    const userId = req.user._id;

    await Notification.updateMany(
      {
        $or: [{ role: 'all' }, { role: role }, { user: userId }],
        unread: true
      },
      { unread: false }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    next(error);
  }
};
