import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['organization', 'appearance', 'notifications', 'security', 'ai', 'system'],
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    type: {
      type: String,
      enum: ['string', 'number', 'boolean', 'object', 'array'],
      default: 'string',
    },
    description: {
      type: String,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

settingSchema.index({ category: 1 });

export const Setting = mongoose.model('Setting', settingSchema);
