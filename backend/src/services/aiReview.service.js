import { AIReview } from '../models/AIReview.model.js';
import { Appointment } from '../models/Appointment.model.js';
import { Task } from '../models/Task.model.js';
import { Prediction } from '../models/Prediction.model.js';
import { generateBottleneckPrediction } from './groq.service.js';

export const aiReviewService = {
  async list({ status, severity, module, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = {}) {
    const query = { isDeleted: false };
    if (status) query.status = status;
    if (severity) query.severity = severity;
    if (module) query.module = module;

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [reviews, total] = await Promise.all([
      AIReview.find(query)
        .populate('reviewedBy', 'firstName lastName email')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      AIReview.countDocuments(query),
    ]);

    return {
      data: reviews,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async getById(id) {
    const review = await AIReview.findOne({ _id: id, isDeleted: false })
      .populate('reviewedBy', 'firstName lastName email');
    if (!review) throw new Error('AI Review not found');
    return review;
  },

  async create(data) {
    try {
      const last = await AIReview.findOne().sort({ createdAt: -1 });
      const lastNum = last ? parseInt((last.reviewId || 'AIR-000000').split('-')[1] || 0) : 0;
      const reviewId = data.reviewId || `AIR-${String(lastNum + 1).padStart(6, '0')}`;

      const review = new AIReview({ reviewId, ...data });
      await review.save();
      return await AIReview.findById(review._id).populate('reviewedBy', 'firstName lastName email');
    } catch (error) {
      if (error.code === 11000) throw new Error('A review with this ID already exists');
      throw error;
    }
  },

  async update(id, data) {
    const review = await AIReview.findOneAndUpdate(
      { _id: id, isDeleted: false },
      data,
      { new: true, runValidators: true }
    ).populate('reviewedBy', 'firstName lastName email');
    if (!review) throw new Error('AI Review not found');
    return review;
  },

  async approve(id, userId, note) {
    const review = await AIReview.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        status: 'approved',
        reviewedBy: userId,
        reviewedAt: new Date(),
        reviewNote: note,
      },
      { new: true }
    ).populate('reviewedBy', 'firstName lastName email');
    if (!review) throw new Error('AI Review not found');
    return review;
  },

  async reject(id, userId, note) {
    if (!note) throw new Error('A reason is required when rejecting an AI recommendation');
    const review = await AIReview.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        status: 'rejected',
        reviewedBy: userId,
        reviewedAt: new Date(),
        reviewNote: note,
      },
      { new: true }
    ).populate('reviewedBy', 'firstName lastName email');
    if (!review) throw new Error('AI Review not found');
    return review;
  },

  async dismiss(id, userId, note) {
    const review = await AIReview.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        status: 'dismissed',
        reviewedBy: userId,
        reviewedAt: new Date(),
        reviewNote: note,
      },
      { new: true }
    );
    if (!review) throw new Error('AI Review not found');
    return review;
  },

  async remove(id) {
    const review = await AIReview.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
    if (!review) throw new Error('AI Review not found');
    return review;
  },

  async generateFromOperationalData() {
    try {
      const now = new Date();
      const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const [
        todayAppointments,
        overdueTasksCount,
        highRiskPredictions,
        pendingTasks,
        completedToday,
      ] = await Promise.all([
        Appointment.countDocuments({ appointmentDate: { $gte: dayAgo }, isDeleted: false }),
        Task.countDocuments({ status: { $ne: 'Completed' }, dueDate: { $lt: now }, isDeleted: false }),
        Prediction.countDocuments({ 'aiResult.riskLevel': { $in: ['High', 'Critical'] }, isDeleted: false }),
        Task.countDocuments({ status: 'Pending', isDeleted: false }),
        Appointment.countDocuments({ status: 'Completed', updatedAt: { $gte: dayAgo }, isDeleted: false }),
      ]);

      const operationalData = {
        appointments: todayAppointments,
        overdueTasks: overdueTasksCount,
        highRiskPredictions,
        pendingTasks,
        completedToday,
        peakHours: '9am-11am and 2pm-4pm',
        history: `${completedToday} completed in last 24h`,
      };

      let aiText = '';
      try {
        aiText = await generateBottleneckPrediction(operationalData);
      } catch (err) {
        console.warn('AI generation skipped:', err.message);
        aiText = buildFallbackRecommendation(operationalData);
      }

      const reviews = buildReviewsFromAnalysis(aiText, operationalData);
      const created = [];
      for (const r of reviews) {
        try {
          const saved = await this.create(r);
          created.push(saved);
        } catch (_) { /* skip duplicates */ }
      }
      return created;
    } catch (error) {
      console.error('Generate AI reviews error:', error);
      throw error;
    }
  },

  async getDashboardStats() {
    const [total, pending, approved, rejected] = await Promise.all([
      AIReview.countDocuments({ isDeleted: false }),
      AIReview.countDocuments({ status: 'pending', isDeleted: false }),
      AIReview.countDocuments({ status: 'approved', isDeleted: false }),
      AIReview.countDocuments({ status: 'rejected', isDeleted: false }),
    ]);
    const recent = await AIReview.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(5);
    return { total, pending, approved, rejected, recent };
  },
};

function buildFallbackRecommendation(data) {
  const lines = [];
  if (data.overdueTasks > 0) lines.push(`${data.overdueTasks} tasks are overdue and need immediate attention.`);
  if (data.highRiskPredictions > 0) lines.push(`${data.highRiskPredictions} high-risk patient predictions require clinical review.`);
  if (data.todayAppointments > 15) lines.push('High appointment volume today may strain resources during peak hours.');
  return lines.join(' ') || 'Operations appear stable. Continue monitoring key metrics.';
}

function buildReviewsFromAnalysis(aiText, data) {
  const ts = Date.now();
  const reviews = [];

  if (data.overdueTasks > 2) {
    reviews.push({
      title: `${data.overdueTasks} overdue tasks need immediate reassignment`,
      description: `Task backlog has grown to ${data.overdueTasks} overdue items, risking SLA breach.`,
      severity: data.overdueTasks > 5 ? 'critical' : 'watch',
      module: 'tasks',
      confidence: 88,
      recommendation: 'Reassign overdue tasks or escalate to manager for triage.',
      expectedImpact: 'Reduces SLA risk and improves team throughput.',
      assumptions: 'Staff capacity is available for reassignment.',
      constraints: 'Requires manager approval for cross-department reassignment.',
      aiExplanation: aiText.slice(0, 400),
      predictedFor: new Date(),
      sourceData: { overdueTasks: data.overdueTasks, pendingTasks: data.pendingTasks },
    });
  }

  if (data.highRiskPredictions > 0) {
    reviews.push({
      title: `${data.highRiskPredictions} high-risk AI predictions require clinical review`,
      description: 'Unreviewed high-risk predictions may delay critical interventions.',
      severity: 'watch',
      module: 'predictions',
      confidence: 82,
      recommendation: 'Schedule immediate review of all High/Critical risk predictions with attending veterinarians.',
      expectedImpact: 'Early intervention reduces patient deterioration risk.',
      assumptions: 'Veterinarians are available for same-day review.',
      constraints: 'AI predictions are advisory — clinical judgment takes precedence.',
      aiExplanation: aiText.slice(0, 400),
      predictedFor: new Date(),
      sourceData: { highRiskPredictions: data.highRiskPredictions },
    });
  }

  if (data.appointments > 10) {
    reviews.push({
      title: 'Appointment volume approaching capacity threshold',
      description: `${data.appointments} appointments in the last 24h indicates high load. Peak-hour bottlenecks are likely.`,
      severity: data.appointments > 20 ? 'critical' : 'watch',
      module: 'capacity',
      confidence: 75,
      recommendation: 'Consider opening additional exam rooms or redistributing appointments across time slots.',
      expectedImpact: 'Reduces average wait time by an estimated 20-30%.',
      assumptions: 'Additional room and staff resources are available.',
      constraints: 'Scheduling changes require at least 2-hour lead time.',
      aiExplanation: aiText.slice(0, 400),
      predictedFor: new Date(Date.now() + 4 * 3600000),
      sourceData: { todayAppointments: data.appointments, completedToday: data.completedToday },
    });
  }

  // Always add at least one info-level recommendation
  if (reviews.length === 0) {
    reviews.push({
      title: 'Operations within normal parameters',
      description: 'Current workload and resource utilization are within expected ranges.',
      severity: 'info',
      module: 'system',
      confidence: 70,
      recommendation: 'Continue standard monitoring cadence. No immediate action required.',
      expectedImpact: 'Maintains current service levels.',
      assumptions: 'No unexpected demand spikes.',
      constraints: 'None.',
      aiExplanation: aiText.slice(0, 400) || 'All systems operating normally.',
      predictedFor: new Date(),
      sourceData: data,
    });
  }

  return reviews.map((r, i) => ({
    ...r,
    reviewId: `AIR-${String(ts + i).slice(-6)}`,
  }));
}
