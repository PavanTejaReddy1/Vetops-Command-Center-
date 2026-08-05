# VetOps Command Center

An AI-powered Veterinary Care Predictive Operations Command Center. A production-ready full-stack application for managing veterinary hospital operations with AI-powered predictions, forecasting, and comprehensive analytics.

## Features

- **Dashboard**: Real-time operational overview with KPI cards, predictive alerts, and workflow queue
- **Veterinarians Management**: CRUD operations for veterinary staff with workload tracking
- **Appointments Management**: Schedule and manage patient appointments with priority and status tracking
- **Task Assignment**: Create, assign, and track tasks with priority levels and due dates
- **AI Predictions**: AI-powered diagnostic predictions using Groq API with risk assessment
- **Forecast Capacity**: Predictive analytics for operational capacity and resource planning
- **Reports & Analytics**: Comprehensive operational reports with export functionality (CSV/JSON)
- **Notifications**: Real-time notification system with read/unread states and filtering
- **Audit Logs**: Complete audit trail of all system actions for compliance
- **Settings**: Configurable application settings for organization, appearance, notifications, and security

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **Sora, Inter, IBM Plex Mono** - Typography

### Backend
- **Node.js 18+** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Groq SDK** - AI integration
- **Zod** - Schema validation
- **Helmet** - Security headers
- **Compression** - Response compression
- **Express Rate Limit** - Rate limiting
- **Morgan** - Request logging

## Architecture

The application follows a clean architecture pattern with clear separation of concerns:

### Frontend Architecture
```
frontend/
├── src/
│   ├── app/
│   │   ├── router.jsx              # Route configuration with lazy loading
│   │   └── providers/
│   │       ├── AppProviders.jsx    # Context providers composition
│   │       └── ThemeProvider.jsx   # Theme management
│   ├── layouts/
│   │   ├── DashboardLayout.jsx     # Main layout shell
│   │   ├── Sidebar.jsx             # Navigation sidebar
│   │   ├── Topbar.jsx              # Top navigation bar
│   │   └── Breadcrumbs.jsx         # Breadcrumb navigation
│   ├── components/ui/              # Reusable UI components
│   ├── pages/                      # Feature pages
│   ├── hooks/                      # Custom React hooks
│   ├── lib/
│   │   ├── api/                    # API client services
│   │   └── utils/                  # Utility functions
│   └── config/                     # Configuration files
```

### Backend Architecture
```
backend/
├── src/
│   ├── app.js                      # Express app factory
│   ├── config/
│   │   └── database.js             # MongoDB connection
│   ├── routes/                    # API route definitions
│   ├── controllers/                # Request handlers
│   ├── services/                   # Business logic layer
│   ├── models/                     # Mongoose schemas
│   ├── middleware/                 # Express middleware
│   ├── validators/                 # Request validation
│   └── utils/                      # Utility functions
```

## Installation

### Prerequisites
- Node.js 18 or higher
- MongoDB (local or Atlas)
- npm or yarn

### Clone the repository
```bash
git clone https://github.com/PavanTejaReddy1/Vetops-Command-Center-.git
cd Vetops-Command-Center-
```

### Install dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd backend
npm install
```

## Environment Variables

Create a `.env` file in the `backend` directory based on `.env.example`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/vetops

# Authentication
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
JWT_EXPIRES_IN=7d

# AI Integration (Groq)
GROQ_API_KEY=your-groq-api-key-here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:5173
```

## Running the Application

### Development Mode

**Start Backend:**
```bash
cd backend
npm run dev
```
Backend will run on http://localhost:5000

**Start Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on http://localhost:5173

### Production Mode

**Build Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

**Start Backend:**
```bash
cd backend
npm start
```

## Login Credentials

After seeding the database, you can log in with the following credentials:

- **Email**: admin@vetops.com
- **Password**: admin123

**Security Note**: Please change the default password after your first login for security reasons.

## Seeding Database

Create an admin user:
```bash
cd backend
npm run seed:admin
```

This will create an admin user with:
- Email: admin@vetops.com
- Password: admin123
- Role: admin

**Important:** Change the default password after first login.

## AI Configuration

To enable AI predictions, you need a Groq API key:

1. Sign up at [Groq Console](https://console.groq.com/)
2. Create an API key
3. Add it to your `.env` file:
   ```env
   GROQ_API_KEY=your-groq-api-key-here
   ```

The AI module provides:
- Diagnostic predictions based on symptoms and medical history
- Risk level assessment (Low, Medium, High, Critical)
- Confidence scores
- Recommended tests and treatments
- Follow-up advice

## API Documentation

### Authentication
All API endpoints (except `/health` and `/api/v1/auth/login`) require authentication via JWT token.

### Base URL
- Development: `http://localhost:5000/api/v1`
- Production: Configured via `FRONTEND_URL`

### Main Endpoints

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

#### Veterinarians
- `GET /veterinarians` - List all veterinarians
- `GET /veterinarians/:id` - Get veterinarian by ID
- `POST /veterinarians` - Create veterinarian
- `PUT /veterinarians/:id` - Update veterinarian
- `DELETE /veterinarians/:id` - Delete veterinarian

#### Appointments
- `GET /appointments` - List appointments with filters
- `GET /appointments/:id` - Get appointment by ID
- `POST /appointments` - Create appointment
- `PUT /appointments/:id` - Update appointment
- `DELETE /appointments/:id` - Delete appointment

#### Tasks
- `GET /tasks` - List tasks with filters
- `GET /tasks/:id` - Get task by ID
- `POST /tasks` - Create task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

#### Predictions
- `GET /predictions` - List predictions
- `GET /predictions/:id` - Get prediction by ID
- `POST /predictions` - Create AI prediction
- `PUT /predictions/:id` - Update prediction
- `DELETE /predictions/:id` - Delete prediction

#### Forecasts
- `GET /forecasts/summary` - Forecast summary
- `GET /forecasts/appointment-trends` - Appointment trends
- `GET /forecasts/veterinarian-workload` - Veterinarian workload
- `GET /forecasts/prediction-trends` - Prediction trends
- `GET /forecasts/risk-distribution` - Risk distribution

#### Reports
- `GET /reports/summary` - Report summary
- `GET /reports/appointment-analytics` - Appointment analytics
- `GET /reports/export/:format` - Export reports (CSV/JSON)

#### Notifications
- `GET /notifications` - List notifications
- `GET /notifications/:id` - Get notification by ID
- `PATCH /notifications/:id/read` - Mark as read
- `PATCH /notifications/read-all` - Mark all as read
- `GET /notifications/unread-count` - Get unread count

#### Audit Logs
- `GET /audit-logs` - List audit logs with filters
- `GET /audit-logs/:id` - Get audit log by ID
- `POST /audit-logs` - Create audit log
- `GET /audit-logs/export/:format` - Export audit logs (CSV/JSON)

#### Settings
- `GET /settings` - Get all settings
- `GET /settings/:category` - Get settings by category
- `PUT /settings/:key` - Update single setting
- `PUT /settings/category/:category` - Update category settings
- `POST /settings/:category/reset` - Reset to defaults

## Deployment

### Docker Deployment

Build and run using Docker Compose:

```bash
# Create .env file in root directory
cp .env.example .env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services:
- **Frontend**: Nginx serving React build on port 80
- **Backend**: Node.js API on port 5000
- **MongoDB**: MongoDB on port 27017

### Manual Deployment

**Frontend:**
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your web server (Nginx, Apache, Vercel, Netlify, etc.)
3. Configure reverse proxy to handle API routes

**Backend:**
1. Set environment variables
2. Install dependencies: `npm ci --only=production`
3. Start the server: `npm start`
4. Use PM2 for process management in production

### CI/CD

The project includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that:
- Installs dependencies
- Runs linting
- Builds frontend and backend
- Runs tests
- Builds Docker images

## Security Features

- **Helmet**: Security headers for Express
- **CORS**: Configured cross-origin resource sharing
- **Rate Limiting**: API rate limiting to prevent abuse
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Environment Validation**: Validates required environment variables on startup
- **Audit Logging**: Complete audit trail of all system actions
- **Input Validation**: Zod schemas for request validation

## Performance Optimizations

- **MongoDB Indexes**: Optimized queries with proper indexes
- **Response Compression**: Gzip compression for API responses
- **Frontend Lazy Loading**: Code splitting for optimal bundle size
- **React.memo**: Optimized re-renders where applicable
- **API Response Caching**: Where appropriate

## Future Improvements

- [ ] Add comprehensive unit and integration tests
- [ ] Implement WebSocket for real-time updates
- [ ] Add file upload functionality for attachments
- [ ] Implement advanced reporting with custom queries
- [ ] Add multi-language support (i18n)
- [ ] Implement offline support with service workers
- [ ] Add mobile app (React Native)
- [ ] Implement advanced AI models
- [ ] Add data visualization with more chart types
- [ ] Implement role-based access control (RBAC)

## Screenshots

*Placeholder for application screenshots*

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify network connectivity

### AI Predictions Not Working
- Verify `GROQ_API_KEY` is set correctly
- Check API key has sufficient credits
- Review console for error messages

### Frontend Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (requires 18+)
- Verify all environment variables are set

## License

This project is proprietary software. All rights reserved.

## Support

For support and inquiries, please contact the development team.
