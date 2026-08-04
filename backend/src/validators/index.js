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

export const validators = {
  createVeterinarian: createVeterinarianSchema,
  updateVeterinarian: updateVeterinarianSchema,
};
