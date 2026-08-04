import { z } from 'zod';

export const createVeterinarianSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  employeeId: z.string().min(1, 'Employee ID is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  specialization: z.enum([
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
  ], { required_error: 'Specialization is required' }),
  qualification: z.string().min(1, 'Qualification is required'),
  yearsOfExperience: z.number().min(0, 'Years of experience must be at least 0'),
  department: z.enum([
    'Emergency',
    'Surgery',
    'Internal Medicine',
    'Outpatient',
    'Diagnostic',
    'Other',
  ], { required_error: 'Department is required' }),
  status: z.enum(['Active', 'On Leave', 'Inactive']).optional(),
  availability: z.enum(['Available', 'Busy', 'Off Duty']).optional(),
  profileImage: z.string().url().optional().or(z.literal('')),
});

export const updateVeterinarianSchema = createVeterinarianSchema.partial();

export const createAppointmentSchema = z.object({
  appointmentId: z.string().min(1, 'Appointment ID is required'),
  petName: z.string().min(1, 'Pet name is required'),
  animalType: z.enum(['Dog', 'Cat', 'Bird', 'Reptile', 'Small Mammal', 'Other'], { required_error: 'Animal type is required' }),
  breed: z.string().optional(),
  ownerName: z.string().min(1, 'Owner name is required'),
  ownerPhone: z.string().optional(),
  veterinarian: z.string().min(1, 'Veterinarian is required'),
  appointmentDate: z.string().min(1, 'Appointment date is required'),
  appointmentTime: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
  visitType: z.enum([
    'Wellness Exam',
    'Vaccination',
    'Emergency',
    'Surgery',
    'Dermatology',
    'Cardiology',
    'Dental',
    'Follow-up',
    'Other',
  ], { required_error: 'Visit type is required' }),
  symptoms: z.string().optional(),
  notes: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High', 'Emergency']).optional(),
  status: z.enum(['Scheduled', 'In Progress', 'Completed', 'Cancelled']).optional(),
  room: z.string().optional(),
  durationMins: z.number().min(5, 'Duration must be at least 5 minutes').optional(),
});

export const updateAppointmentSchema = createAppointmentSchema.partial();

export const createTaskSchema = z.object({
  taskId: z.string().min(1, 'Task ID is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  assignedTo: z.string().min(1, 'Assignee is required'),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
  category: z.enum(['Administrative', 'Clinical', 'Maintenance', 'Communication', 'Other']).optional(),
  dueDate: z.string().optional(),
  status: z.enum(['Pending', 'In Progress', 'Completed', 'Cancelled']).optional(),
  createdBy: z.string().optional(),
  attachments: z.array(z.object({ name: z.string(), url: z.string().url() })).optional(),
  notes: z.string().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export const createPredictionSchema = z.object({
  predictionId: z.string().min(1, 'Prediction ID is required'),
  animalName: z.string().min(1, 'Animal name is required'),
  species: z.string().min(1, 'Species is required'),
  breed: z.string().optional(),
  age: z.number().min(0).optional(),
  weight: z.number().min(0).optional(),
  gender: z.enum(['Male', 'Female', 'Unknown']).optional(),
  symptoms: z.string().optional(),
  medicalHistory: z.string().optional(),
  currentMedications: z.string().optional(),
  bodyTemperature: z.number().optional(),
  heartRate: z.number().min(0).optional(),
  respiratoryRate: z.number().min(0).optional(),
  laboratoryResults: z.string().optional(),
  additionalNotes: z.string().optional(),
  createdBy: z.string().optional(),
});

export const validators = {
  createVeterinarian: createVeterinarianSchema,
  updateVeterinarian: updateVeterinarianSchema,
  createAppointment: createAppointmentSchema,
  updateAppointment: updateAppointmentSchema,
  createTask: createTaskSchema,
  updateTask: updateTaskSchema,
  createPrediction: createPredictionSchema,
};
