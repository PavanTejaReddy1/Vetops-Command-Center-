import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    notificationId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['success', 'warning', 'error', 'info'],
      default: 'info',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    module: {
      type: String,
      enum: ['appointments', 'tasks', 'predictions', 'forecasts', 'reports', 'system'],
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
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

notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });
notificationSchema.index({ module: 1, createdAt: -1 });
notificationSchema.index({ isDeleted: 1 });

export const Notification = mongoose.model('Notification', notificationSchema);
