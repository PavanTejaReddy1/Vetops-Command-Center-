import mongoose from 'mongoose';

const aiReviewSchema = new mongoose.Schema(
  {
    reviewId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    severity: {
      type: String,
      enum: ['critical', 'watch', 'info'],
      default: 'info',
    },
    module: {
      type: String,
      enum: ['appointments', 'tasks', 'predictions', 'forecasts', 'reports', 'system', 'capacity'],
      required: true,
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      default: 70,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'dismissed'],
      default: 'pending',
    },
    recommendation: {
      type: String,
      trim: true,
    },
    expectedImpact: {
      type: String,
      trim: true,
    },
    assumptions: {
      type: String,
      trim: true,
    },
    constraints: {
      type: String,
      trim: true,
    },
    aiExplanation: {
      type: String,
      trim: true,
    },
    modelVersion: {
      type: String,
      default: 'llama3-70b-8192',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
    reviewNote: {
      type: String,
      trim: true,
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    predictedFor: {
      type: Date,
    },
    sourceData: {
      type: mongoose.Schema.Types.Mixed,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

aiReviewSchema.index({ status: 1, createdAt: -1 });
aiReviewSchema.index({ severity: 1 });
aiReviewSchema.index({ module: 1 });
aiReviewSchema.index({ isDeleted: 1 });

export const AIReview = mongoose.model('AIReview', aiReviewSchema);
