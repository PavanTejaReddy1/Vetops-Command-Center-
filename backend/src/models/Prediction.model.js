import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema(
  {
    predictionId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    animalName: {
      type: String,
      required: true,
      trim: true,
    },
    species: {
      type: String,
      required: true,
      trim: true,
    },
    breed: {
      type: String,
      trim: true,
    },
    age: {
      type: Number,
    },
    weight: {
      type: Number,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Unknown'],
    },
    symptoms: {
      type: String,
      trim: true,
    },
    medicalHistory: {
      type: String,
      trim: true,
    },
    currentMedications: {
      type: String,
      trim: true,
    },
    bodyTemperature: {
      type: Number,
    },
    heartRate: {
      type: Number,
    },
    respiratoryRate: {
      type: Number,
    },
    laboratoryResults: {
      type: String,
      trim: true,
    },
    additionalNotes: {
      type: String,
      trim: true,
    },
    aiResult: {
      possibleConditions: [{
        condition: String,
        likelihood: Number,
      }],
      riskLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
      },
      confidenceScore: {
        type: Number,
        min: 0,
        max: 100,
      },
      recommendedTests: [String],
      immediateCareSuggestions: [String],
      recommendedTreatments: [String],
      followUpAdvice: String,
      preventiveRecommendations: [String],
      aiExplanation: String,
    },
    createdBy: {
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

predictionSchema.index({ animalName: 'text', predictionId: 'text' });
predictionSchema.index({ species: 1 });
predictionSchema.index({ riskLevel: 1 });
predictionSchema.index({ createdAt: -1 });
predictionSchema.index({ isDeleted: 1 });

export const Prediction = mongoose.model('Prediction', predictionSchema);
