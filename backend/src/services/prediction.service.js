import { Prediction } from '../models/Prediction.model.js';
import { generateBottleneckPrediction } from './groq.service.js';

export const predictionService = {
  async list({ search, species, riskLevel, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' }) {
    const query = { isDeleted: false };

    if (search) {
      query.$or = [
        { animalName: { $regex: search, $options: 'i' } },
        { predictionId: { $regex: search, $options: 'i' } },
      ];
    }

    if (species) {
      query.species = species;
    }

    if (riskLevel) {
      query['aiResult.riskLevel'] = riskLevel;
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [predictions, total] = await Promise.all([
      Prediction.find(query).sort(sort).skip(skip).limit(limit),
      Prediction.countDocuments(query),
    ]);

    return {
      data: predictions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getById(id) {
    const prediction = await Prediction.findOne({ _id: id, isDeleted: false });
    if (!prediction) {
      throw new Error('Prediction not found');
    }
    return prediction;
  },

  async createWithAI(data) {
    try {
      const predictionData = {
        ...data,
        aiResult: null,
      };

      const prediction = new Prediction(predictionData);
      await prediction.save();

      try {
        const aiPrompt = buildVeterinaryPredictionPrompt(data);
        const aiResponse = await generateBottleneckPrediction({
          ...data,
          prompt: aiPrompt,
        });

        const parsedAIResult = parseAIResponse(aiResponse);

        prediction.aiResult = parsedAIResult;
        await prediction.save();
      } catch (aiError) {
        console.error('AI generation failed, saving prediction without AI result:', aiError);
      }

      return await Prediction.findById(prediction._id);
    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        throw new Error(`A prediction with this ${field} already exists`);
      }
      throw error;
    }
  },

  async remove(id) {
    const prediction = await Prediction.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!prediction) {
      throw new Error('Prediction not found');
    }

    return prediction;
  },
};

function buildVeterinaryPredictionPrompt(data) {
  return `
    You are a veterinary AI diagnostic assistant. Analyze the following patient data and provide a structured JSON prediction.

    Patient Information:
    - Animal Name: ${data.animalName}
    - Species: ${data.species}
    - Breed: ${data.breed || 'Unknown'}
    - Age: ${data.age || 'Unknown'} years
    - Weight: ${data.weight || 'Unknown'} kg
    - Gender: ${data.gender || 'Unknown'}

    Clinical Data:
    - Symptoms: ${data.symptoms || 'Not provided'}
    - Medical History: ${data.medicalHistory || 'Not provided'}
    - Current Medications: ${data.currentMedications || 'None'}
    - Body Temperature: ${data.bodyTemperature || 'Unknown'}°C
    - Heart Rate: ${data.heartRate || 'Unknown'} bpm
    - Respiratory Rate: ${data.respiratoryRate || 'Unknown'} breaths/min
    - Laboratory Results: ${data.laboratoryResults || 'Not provided'}
    - Additional Notes: ${data.additionalNotes || 'None'}

    Provide a JSON response with the following structure:
    {
      "possibleConditions": [
        { "condition": "condition name", "likelihood": 0-100 }
      ],
      "riskLevel": "Low" | "Medium" | "High" | "Critical",
      "confidenceScore": 0-100,
      "recommendedTests": ["test1", "test2"],
      "immediateCareSuggestions": ["suggestion1", "suggestion2"],
      "recommendedTreatments": ["treatment1", "treatment2"],
      "followUpAdvice": "detailed follow-up advice",
      "preventiveRecommendations": ["prevention1", "prevention2"],
      "aiExplanation": "brief explanation of the reasoning"
    }

    Return ONLY the JSON, no additional text.
  `;
}

function parseAIResponse(response) {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return {
      possibleConditions: [],
      riskLevel: 'Medium',
      confidenceScore: 50,
      recommendedTests: [],
      immediateCareSuggestions: [],
      recommendedTreatments: [],
      followUpAdvice: 'AI response could not be parsed',
      preventiveRecommendations: [],
      aiExplanation: response,
    };
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    return {
      possibleConditions: [],
      riskLevel: 'Medium',
      confidenceScore: 50,
      recommendedTests: [],
      immediateCareSuggestions: [],
      recommendedTreatments: [],
      followUpAdvice: 'AI response could not be parsed',
      preventiveRecommendations: [],
      aiExplanation: response,
    };
  }
}
