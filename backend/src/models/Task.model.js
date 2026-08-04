import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    taskId: {
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
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Veterinarian',
      required: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    category: {
      type: String,
      enum: ['Administrative', 'Clinical', 'Maintenance', 'Communication', 'Other'],
      default: 'Other',
    },
    dueDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    createdBy: {
      type: String,
      trim: true,
    },
    attachments: [{
      name: String,
      url: String,
    }],
    notes: {
      type: String,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({ taskId: 1 });
taskSchema.index({ title: 'text', taskId: 'text' });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ isDeleted: 1 });

export const Task = mongoose.model('Task', taskSchema);
