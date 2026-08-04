/**
 * Groq AI integration — PHASE 2.
 *
 * This module provides AI-powered functionality for:
 * - Prediction generation
 * - AI Review recommendations
 * - Natural-language report summaries
 */

import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Generate bottleneck predictions based on operational data
 */
export async function generateBottleneckPrediction(operationalData) {
  try {
    const prompt = buildBottleneckPrompt(operationalData);
    const response = await groq.chat.completions.create({
      model: 'llama3-70b-8192',
      messages: [
        {
          role: 'system',
          content: 'You are an expert veterinary operations analyst. Analyze operational data to predict potential bottlenecks and provide actionable recommendations.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    return response.choices[0]?.message?.content || 'No prediction generated';
  } catch (error) {
    console.error('Groq API error:', error);
    throw new Error(`Failed to generate prediction: ${error.message}`);
  }
}

/**
 * Generate AI review recommendations
 */
export async function generateAIReviewRecommendations(reviewData) {
  try {
    const prompt = buildReviewPrompt(reviewData);
    const response = await groq.chat.completions.create({
      model: 'llama3-70b-8192',
      messages: [
        {
          role: 'system',
          content: 'You are a veterinary AI assistant providing review recommendations for clinical cases.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.6,
      max_tokens: 1024,
    });

    return response.choices[0]?.message?.content || 'No recommendations generated';
  } catch (error) {
    console.error('Groq API error:', error);
    throw new Error(`Failed to generate recommendations: ${error.message}`);
  }
}

/**
 * Generate natural-language report summaries
 */
export async function generateReportSummary(reportData) {
  try {
    const prompt = buildReportPrompt(reportData);
    const response = await groq.chat.completions.create({
      model: 'llama3-70b-8192',
      messages: [
        {
          role: 'system',
          content: 'You are a veterinary operations analyst creating concise, actionable summaries of operational reports.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 512,
    });

    return response.choices[0]?.message?.content || 'No summary generated';
  } catch (error) {
    console.error('Groq API error:', error);
    throw new Error(`Failed to generate summary: ${error.message}`);
  }
}

function buildBottleneckPrompt(data) {
  return `
    Analyze the following veterinary operational data and predict potential bottlenecks:
    
    - Appointments scheduled: ${data.appointments || 0}
    - Staff availability: ${data.staff || 0}
    - Equipment status: ${data.equipment || 'unknown'}
    - Peak hours: ${data.peakHours || 'unknown'}
    - Historical patterns: ${data.history || 'none'}
    
    Provide:
    1. Likely bottleneck areas
    2. Time windows when issues may occur
    3. Specific recommendations to mitigate
  `;
}

function buildReviewPrompt(data) {
  return `
    Review the following veterinary case data and provide recommendations:
    
    - Patient symptoms: ${data.symptoms || 'not provided'}
    - Diagnosis: ${data.diagnosis || 'not provided'}
    - Treatment plan: ${data.treatment || 'not provided'}
    - Current status: ${data.status || 'unknown'}
    
    Provide:
    1. Assessment of current approach
    2. Alternative treatment considerations
    3. Risk factors to monitor
  `;
}

function buildReportPrompt(data) {
  return `
    Summarize the following veterinary operations report:
    
    - Period: ${data.period || 'unknown'}
    - Key metrics: ${JSON.stringify(data.metrics || {})}
    - Notable events: ${data.events || 'none'}
    - Trends observed: ${data.trends || 'none'}
    
    Provide a concise summary (2-3 sentences) highlighting the most important insights.
  `;
}
