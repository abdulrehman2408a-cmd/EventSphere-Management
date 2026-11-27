import Message from '../models/Message.js';
import Exhibitor from '../models/Exhibitor.js';
import { emitToUser, emitToRole } from '../services/socketService.js';

// @desc    Get messages for logged in user or admin
// @route   GET /api/messages
// @access  Private (or Public for visitor contact form)
export const getMessages = async (req, res, next) => {
  try {
    let filter = {};

    if (req.user) {
      if (req.user.role === 'admin') {
        // Admin sees all messages
        filter = {};
      } else if (req.user.role === 'exhibitor') {
        // Exhibitor sees messages directed to them or their exhibitor profile
        const exhibitor = await Exhibitor.findOne({ user: req.user._id });
        filter = {
          $or: [
            { recipient: req.user._id },
            { sender: req.user._id },
            { to: 'Organizer Support' },
            ...(exhibitor ? [{ exhibitor: exhibitor._id }] : [])
          ]
        };
      } else {
        // Attendee sees messages they sent
        filter = {
          $or: [{ sender: req.user._id }, { senderEmail: req.user.email.toLowerCase() }]
        };
      }
    }

    const messages = await Message.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single message thread
// @route   GET /api/messages/:id
// @access  Private
export const getMessageById = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    // Ownership check
    if (req.user.role !== 'admin') {
      const userId = req.user._id.toString();
      let isAuthorized = message.sender?.toString() === userId ||
                         message.recipient?.toString() === userId;
      
      // If exhibitor, also allow if message was directed to their exhibitor profile
      if (!isAuthorized && req.user.role === 'exhibitor') {
        const exhibitor = await Exhibitor.findOne({ user: req.user._id });
        if (exhibitor && message.exhibitor?.toString() === exhibitor._id.toString()) {
          isAuthorized = true;
        }
      }

      if (!isAuthorized) {
        return res.status(403).json({ success: false, message: 'Access denied: not authorized to view this message thread' });
      }
    }

    res.json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
};

// @desc    Send new message / inquiry
// @route   POST /api/messages
// @access  Public (Visitor) or Private (User)
export const sendMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message, to, exhibitorId, expoId } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    const senderName = req.user ? req.user.name : name || 'Website Visitor';
    const senderEmail = req.user ? req.user.email : email || '';
    const senderRole = req.user ? req.user.role : 'attendee';

    const newMsg = await Message.create({
      sender: req.user ? req.user._id : null,
      senderName,
      senderEmail,
      senderRole,
      to: to || 'Organizer Support',
      from: `${senderName} (${senderEmail || 'Guest'})`,
      subject: subject || 'General Inquiry',
      content: message,
      exhibitor: exhibitorId || null,
      expo: expoId || null,
      status: 'Open',
      time: 'Just now'
    });

    // Real-time broadcast to Admins
    emitToRole('admin', 'new_message', newMsg);

    res.status(201).json({
      success: true,
      message: 'Your message has been received! Our support team will respond shortly.',
      data: newMsg
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reply to a message
// @route   POST /api/messages/:id/reply
// @access  Private
export const replyMessage = async (req, res, next) => {
  try {
    const { text, senderName } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Reply text cannot be empty' });
    }

    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message thread not found' });
    }

    // Only Admin or message parties can reply
    if (req.user.role !== 'admin') {
      const userId = req.user._id.toString();
      let canReply = message.sender?.toString() === userId ||
                     message.recipient?.toString() === userId;

      // If exhibitor, also allow if message was directed to their exhibitor profile
      if (!canReply && req.user.role === 'exhibitor') {
        const exhibitor = await Exhibitor.findOne({ user: req.user._id });
        if (exhibitor && message.exhibitor?.toString() === exhibitor._id.toString()) {
          canReply = true;
        }
      }

      if (!canReply) {
        return res.status(403).json({ success: false, message: 'Access denied: not authorized to reply to this message thread' });
      }
    }

    const replyObj = {
      sender: senderName || (req.user ? req.user.name : 'Support Agent'),
      senderId: req.user ? req.user._id : null,
      text,
      time: 'Just now',
      createdAt: new Date()
    };

    message.replies.push(replyObj);
    message.status = 'Replied';
    await message.save();

    // If original sender is registered, notify them
    if (message.sender) {
      emitToUser(message.sender, 'message_reply', {
        messageId: message._id,
        reply: replyObj
      });
    }

    res.json({
      success: true,
      message: 'Reply dispatched to sender',
      data: message
    });
  } catch (error) {
    next(error);
  }
};
