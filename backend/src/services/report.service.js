import { Appointment } from '../models/Appointment.model.js';
import { Veterinarian } from '../models/Veterinarian.model.js';
import { Prediction } from '../models/Prediction.model.js';
import { Task } from '../models/Task.model.js';

export const reportService = {
  async getAppointmentReport({ startDate, endDate, veterinarian, status, department } = {}) {
    const match = { isDeleted: false };
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }
    if (veterinarian) match.veterinarian = veterinarian;
    if (status) match.status = status;
    if (department) match.department = department;

    const [total, byStatus, byVeterinarian, byDepartment] = await Promise.all([
      Appointment.countDocuments(match),
      Appointment.aggregate([
        { $match: match },
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Appointment.aggregate([
        { $match: match },
        { $group: { _id: '$veterinarian', count: { $sum: 1 } } },
        { $lookup: { from: 'veterinarians', localField: '_id', foreignField: '_id', as: 'vet' } },
        { $unwind: '$vet' },
        { $project: { veterinarianName: '$vet.fullName', count: 1, _id: 0 } },
        { $sort: { count: -1 } },
      ]),
      Appointment.aggregate([
        { $match: match },
        { $group: { _id: '$department', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    return {
      total,
      byStatus,
      byVeterinarian,
      byDepartment,
    };
  },

  async getVeterinarianPerformanceReport({ startDate, endDate, veterinarian } = {}) {
    const match = { isDeleted: false };
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }
    if (veterinarian) match._id = veterinarian;

    const performance = await Appointment.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$veterinarian',
          totalAppointments: { $sum: 1 },
          completedAppointments: { $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] } },
          avgDuration: { $avg: '$durationMins' },
        },
      },
      {
        $lookup: {
          from: 'veterinarians',
          localField: '_id',
          foreignField: '_id',
          as: 'vet',
        },
      },
      { $unwind: '$vet' },
      {
        $project: {
          veterinarianId: '$_id',
          veterinarianName: '$vet.fullName',
          specialization: '$vet.specialization',
          totalAppointments: 1,
          completedAppointments: 1,
          completionRate: {
            $cond: [
              { $eq: ['$totalAppointments', 0] },
              0,
              { $multiply: [{ $divide: ['$completedAppointments', '$totalAppointments'] }, 100] },
            ],
          },
          avgDuration: 1,
          _id: 0,
        },
      },
      { $sort: { completionRate: -1 } },
    ]);

    return performance;
  },

  async getPredictionReport({ startDate, endDate, riskLevel, species } = {}) {
    const match = { isDeleted: false };
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }
    if (riskLevel) match['aiResult.riskLevel'] = riskLevel;
    if (species) match.species = species;

    const [total, byRiskLevel, bySpecies, avgConfidence] = await Promise.all([
      Prediction.countDocuments(match),
      Prediction.aggregate([
        { $match: match },
        { $group: { _id: '$aiResult.riskLevel', count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Prediction.aggregate([
        { $match: match },
        { $group: { _id: '$species', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Prediction.aggregate([
        { $match: match },
        { $group: { _id: null, avgConfidence: { $avg: '$aiResult.confidenceScore' } } },
      ]),
    ]);

    return {
      total,
      byRiskLevel,
      bySpecies,
      avgConfidence: avgConfidence[0]?.avgConfidence || 0,
    };
  },

  async getTaskReport({ startDate, endDate, status, category, assignee } = {}) {
    const match = { isDeleted: false };
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }
    if (status) match.status = status;
    if (category) match.category = category;
    if (assignee) match.assignedTo = assignee;

    const [total, byStatus, byCategory, byAssignee] = await Promise.all([
      Task.countDocuments(match),
      Task.aggregate([
        { $match: match },
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Task.aggregate([
        { $match: match },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Task.aggregate([
        { $match: match },
        { $group: { _id: '$assignedTo', count: { $sum: 1 } } },
        { $lookup: { from: 'veterinarians', localField: '_id', foreignField: '_id', as: 'vet' } },
        { $unwind: '$vet' },
        { $project: { assigneeName: '$vet.fullName', count: 1, _id: 0 } },
        { $sort: { count: -1 } },
      ]),
    ]);

    return {
      total,
      byStatus,
      byCategory,
      byAssignee,
    };
  },

  async getSystemActivityReport({ startDate, endDate } = {}) {
    const match = {};
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }

    const [appointments, predictions, tasks, veterinarians] = await Promise.all([
      Appointment.countDocuments({ ...match, isDeleted: false }),
      Prediction.countDocuments({ ...match, isDeleted: false }),
      Task.countDocuments({ ...match, isDeleted: false }),
      Veterinarian.countDocuments({ status: 'Active' }),
    ]);

    return {
      totalActivities: appointments + predictions + tasks,
      appointments,
      predictions,
      tasks,
      activeVeterinarians: veterinarians,
    };
  },

  async getAnalyticsSummary({ period = 'daily' } = {}) {
    const now = new Date();
    let startDate;

    if (period === 'daily') {
      startDate = new Date(now.setHours(0, 0, 0, 0));
    } else if (period === 'weekly') {
      startDate = new Date(now.setDate(now.getDate() - 7));
    } else if (period === 'monthly') {
      startDate = new Date(now.setMonth(now.getMonth() - 1));
    } else if (period === 'yearly') {
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
    }

    const match = { createdAt: { $gte: startDate }, isDeleted: false };

    const [appointments, predictions, tasks, topVeterinarians] = await Promise.all([
      Appointment.aggregate([
        { $match: match },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            completed: { $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] } },
          },
        },
      ]),
      Prediction.aggregate([
        { $match: match },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            highRisk: { $sum: { $cond: [{ $in: ['$aiResult.riskLevel', ['High', 'Critical']] }, 1, 0] } },
          },
        },
      ]),
      Task.aggregate([
        { $match: match },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            completed: { $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] } },
          },
        },
      ]),
      Appointment.aggregate([
        { $match: match },
        {
          $group: {
            _id: '$veterinarian',
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'veterinarians', localField: '_id', foreignField: '_id', as: 'vet' } },
        { $unwind: '$vet' },
        { $project: { veterinarianName: '$vet.fullName', count: 1, _id: 0 } },
      ]),
    ]);

    return {
      period,
      appointments: appointments[0] || { total: 0, completed: 0 },
      predictions: predictions[0] || { total: 0, highRisk: 0 },
      tasks: tasks[0] || { total: 0, completed: 0 },
      topVeterinarians,
    };
  },
};
