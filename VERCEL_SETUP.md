# Vercel Deployment Setup Guide

## Environment Variables

You need to add the following environment variables in your Vercel project dashboard:

### Steps to add environment variables:
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable below with its value

### Required Environment Variables:

```
# Server Configuration
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app

# Database Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/vetops

# Authentication
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
JWT_EXPIRES_IN=7d

# AI Integration (Groq)
GROQ_API_KEY=your-groq-api-key-here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

### Getting MongoDB Atlas Connection String:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster if you don't have one
3. Click **Connect** → **Connect your application**
4. Select **Node.js** and version 4.1 or later
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Format it as: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/vetops`

### Getting Groq API Key:

1. Go to [Groq Console](https://console.groq.com/)
2. Sign up or log in
3. Navigate to **API Keys**
4. Create a new API key
5. Copy the key

## Deployment Steps

1. **Push your code to GitHub** (already done)
2. **Import project to Vercel** (already done)
3. **Add environment variables** (follow steps above)
4. **Redeploy**:
   - Go to **Deployments** tab
   - Click **Redeploy** button
5. **Check deployment logs** for any errors

## Troubleshooting

### 404 Errors on API Endpoints:
- Ensure `vercel.json` is properly configured
- Check that the API routes are correctly set up
- Verify the build output shows no errors

### Database Connection Errors:
- Verify `MONGODB_URI` is correct
- Check IP whitelist in MongoDB Atlas (allow 0.0.0.0/0 for Vercel)
- Ensure database user has correct permissions

### Authentication Errors:
- Verify `JWT_SECRET` is set and at least 32 characters
- Check that `FRONTEND_URL` matches your frontend domain

### AI Prediction Errors:
- Verify `GROQ_API_KEY` is valid
- Check API key has sufficient credits
