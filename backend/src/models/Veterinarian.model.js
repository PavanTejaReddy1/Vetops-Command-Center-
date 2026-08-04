import mongoose from 'mongoose';

const veterinarianSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    phone: {
      type: String,
      trim: true,
    },
    specialization: {
      type: String,
      required: true,
      enum: [
        'General Practice',
        'Surgery',
        'Internal Medicine',
        'Emergency & Critical Care',
        'Dermatology',
        'Cardiology',
        'Oncology',
        'Neurology',
        'Radiology',
        'Ophthalmology',
        'Other',
      ],
    },
    qualification: {
      type: String,
      required: true,
      trim: true,
    },
    yearsOfExperience: {
      type: Number,
      required: true,
      min: 0,
    },
    department: {
      type: String,
      required: true,
      enum: ['Emergency', 'Surgery', 'Internal Medicine', 'Outpatient', 'Diagnostic', 'Other'],
    },
    status: {
      type: String,
      enum: ['Active', 'On Leave', 'Inactive'],
      default: 'Active',
    },
    availability: {
      type: String,
      enum: ['Available', 'Busy', 'Off Duty'],
      default: 'Available',
    },
    profileImage: {
      type: String,
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

veterinarianSchema.index({ fullName: 'text', email: 'text', employeeId: 'text' });
veterinarianSchema.index({ specialization: 1 });
veterinarianSchema.index({ department: 1 });
veterinarianSchema.index({ status: 1 });
veterinarianSchema.index({ isDeleted: 1 });

export const Veterinarian = mongoose.model('Veterinarian', veterinarianSchema);
