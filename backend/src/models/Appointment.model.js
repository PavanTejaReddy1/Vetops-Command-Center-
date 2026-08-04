import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    petName: {
      type: String,
      required: true,
      trim: true,
    },
    animalType: {
      type: String,
      required: true,
      enum: ['Dog', 'Cat', 'Bird', 'Reptile', 'Small Mammal', 'Other'],
    },
    breed: {
      type: String,
      trim: true,
    },
    ownerName: {
      type: String,
      required: true,
      trim: true,
    },
    ownerPhone: {
      type: String,
      trim: true,
    },
    veterinarian: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Veterinarian',
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    appointmentTime: {
      type: String,
      required: true,
    },
    visitType: {
      type: String,
      required: true,
      enum: ['Wellness Exam', 'Vaccination', 'Emergency', 'Surgery', 'Dermatology', 'Cardiology', 'Dental', 'Follow-up', 'Other'],
    },
    symptoms: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Emergency'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Scheduled',
    },
    room: {
      type: String,
      trim: true,
    },
    durationMins: {
      type: Number,
      default: 30,
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

appointmentSchema.index({ petName: 'text', ownerName: 'text', appointmentId: 'text' });
appointmentSchema.index({ veterinarian: 1 });
appointmentSchema.index({ appointmentDate: 1 });
appointmentSchema.index({ priority: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ isDeleted: 1 });

export const Appointment = mongoose.model('Appointment', appointmentSchema);
