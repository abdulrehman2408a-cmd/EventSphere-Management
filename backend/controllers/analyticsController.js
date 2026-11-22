import Expo from '../models/Expo.js';
import Exhibitor from '../models/Exhibitor.js';
import Booth from '../models/Booth.js';
import Registration from '../models/Registration.js';
import Application from '../models/Application.js';
import Schedule from '../models/Schedule.js';

// @desc    Get Admin Overview & Dashboard Statistics
// @route   GET /api/analytics/overview
// @access  Private (Admin only)
export const getAdminOverviewStats = async (req, res, next) => {
  try {
    const [
      totalExpos,
      totalExhibitors,
      totalBooths,
      bookedBooths,
      totalRegistrations,
      pendingApplications,
      recentRegistrations,
      recentApplications,
      upcomingExpos
    ] = await Promise.all([
      Expo.countDocuments(),
      Exhibitor.countDocuments({ status: 'Approved' }),
      Booth.countDocuments(),
      Booth.countDocuments({ status: 'Booked' }),
      Registration.countDocuments(),
      Application.countDocuments({ status: 'Pending' }),
      Registration.find().sort({ createdAt: -1 }).limit(5).populate('expo', 'title'),
      Application.find().sort({ createdAt: -1 }).limit(5).populate('expo', 'title'),
      Expo.find({ status: 'Published' }).sort({ startDate: 1 }).limit(4)
    ]);

    // Calculate revenue from booked booths and passes
    const bookedBoothDocs = await Booth.find({ status: 'Booked' }).select('pricePKR');
    const boothRevenue = bookedBoothDocs.reduce((acc, b) => acc + (b.pricePKR || 0), 0);

    const registrationDocs = await Registration.find().select('paidAmountPKR');
    const ticketRevenue = registrationDocs.reduce((acc, r) => acc + (r.paidAmountPKR || 0), 0);

    const totalRevenuePKR = boothRevenue + ticketRevenue;

    res.json({
      success: true,
      data: {
        totalExpos,
        totalExhibitors,
        totalBooths,
        bookedBooths,
        availableBooths: Math.max(0, totalBooths - bookedBooths),
        totalAttendees: totalRegistrations,
        pendingApplications,
        totalRevenuePKR,
        boothRevenue,
        ticketRevenue,
        recentRegistrations,
        recentApplications,
        upcomingExpos
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Detailed Analytics & Charts Data
// @route   GET /api/analytics/charts
// @access  Private (Admin only)
export const getAnalyticsCharts = async (req, res, next) => {
  try {
    // Category aggregation
    const exposByCategory = await Expo.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, attendees: { $sum: '$registeredAttendees' } } }
    ]);

    // Booth distribution by hall
    const boothsByHall = await Booth.aggregate([
      {
        $group: {
          _id: '$hall',
          total: { $sum: 1 },
          booked: { $sum: { $cond: [{ $eq: ['$status', 'Booked'] }, 1, 0] } }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        exposByCategory,
        boothsByHall
      }
    });
  } catch (error) {
    next(error);
  }
};
