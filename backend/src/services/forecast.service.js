import { Appointment } from '../models/Appointment.model.js';
import { Veterinarian } from '../models/Veterinarian.model.js';
import { Prediction } from '../models/Prediction.model.js';
import { Task } from '../models/Task.model.js';

export const forecastService = {
  async getForecastSummary({ startDate, endDate } = {}) {
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    const [
      totalAppointments,
      completedAppointments,
      totalPredictions,
      highRiskPredictions,
      totalTasks,
      completedTasks,
      activeVeterinarians,
    ] = await Promise.all([
      Appointment.countDocuments({ ...dateFilter, isDeleted: false }),
      Appointment.countDocuments({ ...dateFilter, isDeleted: false, status: 'Completed' }),
      Prediction.countDocuments({ ...dateFilter, isDeleted: false }),
      Prediction.countDocuments({ ...dateFilter, isDeleted: false, 'aiResult.riskLevel': { $in: ['High', 'Critical'] } }),
      Task.countDocuments({ ...dateFilter, isDeleted: false }),
      Task.countDocuments({ ...dateFilter, isDeleted: false, status: 'Completed' }),
      Veterinarian.countDocuments({ status: 'Active' }),
    ]);

    return {
      appointments: {
        total: totalAppointments,
        completed: completedAppointments,
        completionRate: totalAppointments > 0 ? ((completedAppointments / totalAppointments) * 100).toFixed(1) : 0,
      },
      predictions: {
        total: totalPredictions,
        highRisk: highRiskPredictions,
        highRiskRate: totalPredictions > 0 ? ((highRiskPredictions / totalPredictions) * 100).toFixed(1) : 0,
      },
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        completionRate: totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0,
      },
      veterinarians: {
        active: activeVeterinarians,
      },
    };
  },

  async getAppointmentTrends({ startDate, endDate, period = 'daily' } = {}) {
    const groupBy = period === 'daily' 
      ? { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
      : period === 'weekly'
      ? { $dateToString: { format: '%Y-%U', date: '$createdAt' } }
      : { $dateToString: { format: '%Y-%m', date: '$createdAt' } };

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    const trends = await Appointment.aggregate([
      { $match: { ...dateFilter, isDeleted: false } },
      {
        $group: {
          _id: groupBy,
          count: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', count: 1, completed: 1, _id: 0 } },
    ]);

    return trends;
  },

  async getVeterinarianWorkload({ startDate, endDate } = {}) {
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    const workload = await Appointment.aggregate([
      { $match: { ...dateFilter, isDeleted: false } },
      {
        $group: {
          _id: '$veterinarian',
          totalAppointments: { $sum: 1 },
          completedAppointments: { $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] } },
        },
      },
      {
        $lookup: {
          from: 'veterinarians',
          localField: '_id',
          foreignField: '_id',
          as: 'vetInfo',
        },
      },
      { $unwind: '$vetInfo' },
      {
        $project: {
          veterinarianId: '$_id',
          veterinarianName: '$vetInfo.fullName',
          specialization: '$vetInfo.specialization',
          totalAppointments: 1,
          completedAppointments: 1,
          completionRate: {
            $cond: [
              { $eq: ['$totalAppointments', 0] },
              0,
              { $multiply: [{ $divide: ['$completedAppointments', '$totalAppointments'] }, 100] },
            ],
          },
          _id: 0,
        },
      },
    ]);

    return workload;
  },

  async getPredictionTrends({ startDate, endDate, period = 'daily' } = {}) {
    const groupBy = period === 'daily'
      ? { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
      : period === 'weekly'
      ? { $dateToString: { format: '%Y-%U', date: '$createdAt' } }
      : { $dateToString: { format: '%Y-%m', date: '$createdAt' } };

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    const trends = await Prediction.aggregate([
      { $match: { ...dateFilter, isDeleted: false } },
      {
        $group: {
          _id: groupBy,
          total: { $sum: 1 },
          highRisk: { $sum: { $cond: [{ $in: ['$aiResult.riskLevel', ['High', 'Critical']] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', total: 1, highRisk: 1, _id: 0 } },
    ]);

    return trends;
  },

  async getRiskDistribution({ startDate, endDate } = {}) {
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    const distribution = await Prediction.aggregate([
      { $match: { ...dateFilter, isDeleted: false } },
      {
        $group: {
          _id: '$aiResult.riskLevel',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { riskLevel: '$_id', count: 1, _id: 0 } },
    ]);

    return distribution;
  },

  async getTaskTrends({ startDate, endDate, period = 'daily' } = {}) {
    const groupBy = period === 'daily'
      ? { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
      : period === 'weekly'
      ? { $dateToString: { format: '%Y-%U', date: '$createdAt' } }
      : { $dateToString: { format: '%Y-%m', date: '$createdAt' } };

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    const trends = await Task.aggregate([
      { $match: { ...dateFilter, isDeleted: false } },
      {
        $group: {
          _id: groupBy,
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', total: 1, completed: 1, pending: 1, _id: 0 } },
    ]);

    return trends;
  },

  async getPerformanceMetrics({ startDate, endDate } = {}) {
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    const [avgAppointmentDuration, avgTaskCompletionTime] = await Promise.all([
      Appointment.aggregate([
        { $match: { ...dateFilter, isDeleted: false, status: 'Completed' } },
        {
          $group: {
            _id: null,
            avgDuration: { $avg: '$durationMins' },
          },
        },
      ]),
      Task.aggregate([
        { $match: { ...dateFilter, isDeleted: false, status: 'Completed' } },
        {
          $group: {
            _id: null,
            avgCompletionTime: { $avg: { $subtract: ['$updatedAt', '$createdAt'] } },
          },
        },
      ]),
    ]);

    return {
      avgAppointmentDuration: avgAppointmentDuration[0]?.avgDuration || 0,
      avgTaskCompletionTime: avgTaskCompletionTime[0]?.avgCompletionTime || 0,
    };
  },
};
