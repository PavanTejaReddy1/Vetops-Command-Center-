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

export const validators = {
  createVeterinarian: createVeterinarianSchema,
  updateVeterinarian: updateVeterinarianSchema,
  createAppointment: createAppointmentSchema,
  updateAppointment: updateAppointmentSchema,
};
