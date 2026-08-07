import 'dotenv/config';
import mongoose from 'mongoose';
import { Admin } from '../src/models/User.model.js';
import { Veterinarian } from '../src/models/Veterinarian.model.js';
import { Appointment } from '../src/models/Appointment.model.js';
import { Task } from '../src/models/Task.model.js';
import { Prediction } from '../src/models/Prediction.model.js';
import { Notification } from '../src/models/Notification.model.js';
import { AuditLog } from '../src/models/AuditLog.model.js';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI environment variable is not set');
  process.exit(1);
}

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await Appointment.deleteMany({});
    await Task.deleteMany({});
    await Prediction.deleteMany({});
    await Notification.deleteMany({});
    await AuditLog.deleteMany({});
    await Veterinarian.deleteMany({});
    await Admin.deleteMany({});
    console.log('Existing data cleared');

    // Create admin user
    console.log('Creating admin user...');
    const admin = new Admin({
      email: 'admin@vetops.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
    });
    await admin.save();
    console.log('Admin user created');

    // Create veterinarians
    console.log('Creating veterinarians...');
    const veterinarians = await Veterinarian.create([
      {
        fullName: 'Dr. Sarah Johnson',
        employeeId: 'VET001',
        email: 'sarah.johnson@vetops.com',
        phone: '+1-555-0101',
        specialization: 'General Practice',
        qualification: 'DVM',
        yearsOfExperience: 8,
        department: 'Emergency',
        status: 'Active',
        availability: 'Available',
      },
      {
        fullName: 'Dr. Michael Chen',
        employeeId: 'VET002',
        email: 'michael.chen@vetops.com',
        phone: '+1-555-0102',
        specialization: 'Surgery',
        qualification: 'DVM, DACVS',
        yearsOfExperience: 12,
        department: 'Surgery',
        status: 'Active',
        availability: 'Busy',
      },
      {
        fullName: 'Dr. Emily Rodriguez',
        employeeId: 'VET003',
        email: 'emily.rodriguez@vetops.com',
        phone: '+1-555-0103',
        specialization: 'Emergency & Critical Care',
        qualification: 'DVM, DACVECC',
        yearsOfExperience: 6,
        department: 'Emergency',
        status: 'Active',
        availability: 'Available',
      },
      {
        fullName: 'Dr. James Wilson',
        employeeId: 'VET004',
        email: 'james.wilson@vetops.com',
        phone: '+1-555-0104',
        specialization: 'Internal Medicine',
        qualification: 'DVM, DACVIM',
        yearsOfExperience: 15,
        department: 'Internal Medicine',
        status: 'Active',
        availability: 'Available',
      },
      {
        fullName: 'Dr. Lisa Thompson',
        employeeId: 'VET005',
        email: 'lisa.thompson@vetops.com',
        phone: '+1-555-0105',
        specialization: 'Dermatology',
        qualification: 'DVM, DACVD',
        yearsOfExperience: 7,
        department: 'Outpatient',
        status: 'On Leave',
        availability: 'Off Duty',
      },
    ]);
    console.log(`${veterinarians.length} veterinarians created`);

    // Create appointments
    console.log('Creating appointments...');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const appointments = await Appointment.create([
      {
        appointmentId: 'APT001',
        petName: 'Max',
        animalType: 'Dog',
        breed: 'Golden Retriever',
        ownerName: 'John Smith',
        ownerPhone: '+1-555-1001',
        veterinarian: veterinarians[0]._id,
        appointmentDate: today,
        appointmentTime: '09:00',
        visitType: 'Wellness Exam',
        symptoms: 'Annual checkup',
        notes: 'Vaccinations due',
        priority: 'Medium',
        status: 'Scheduled',
        room: 'Exam Room 1',
        durationMins: 30,
      },
      {
        appointmentId: 'APT002',
        petName: 'Bella',
        animalType: 'Cat',
        breed: 'Persian',
        ownerName: 'Jane Doe',
        ownerPhone: '+1-555-1002',
        veterinarian: veterinarians[1]._id,
        appointmentDate: today,
        appointmentTime: '10:30',
        visitType: 'Surgery',
        symptoms: 'Spay procedure',
        notes: 'Pre-surgical bloodwork completed',
        priority: 'High',
        status: 'In Progress',
        room: 'Surgery Room 1',
        durationMins: 60,
      },
      {
        appointmentId: 'APT003',
        petName: 'Charlie',
        animalType: 'Dog',
        breed: 'German Shepherd',
        ownerName: 'Bob Johnson',
        ownerPhone: '+1-555-1003',
        veterinarian: veterinarians[2]._id,
        appointmentDate: yesterday,
        appointmentTime: '14:00',
        visitType: 'Emergency',
        symptoms: 'Vomiting, lethargy',
        notes: 'Possible poisoning',
        priority: 'Emergency',
        status: 'Completed',
        room: 'Emergency Room 1',
        durationMins: 45,
      },
      {
        appointmentId: 'APT004',
        petName: 'Luna',
        animalType: 'Cat',
        breed: 'Siamese',
        ownerName: 'Alice Brown',
        ownerPhone: '+1-555-1004',
        veterinarian: veterinarians[0]._id,
        appointmentDate: tomorrow,
        appointmentTime: '11:00',
        visitType: 'Vaccination',
        symptoms: 'Annual vaccinations',
        notes: 'First visit',
        priority: 'Low',
        status: 'Scheduled',
        room: 'Exam Room 2',
        durationMins: 20,
      },
      {
        appointmentId: 'APT005',
        petName: 'Rocky',
        animalType: 'Dog',
        breed: 'Bulldog',
        ownerName: 'Tom Wilson',
        ownerPhone: '+1-555-1005',
        veterinarian: veterinarians[3]._id,
        appointmentDate: today,
        appointmentTime: '15:00',
        visitType: 'Dermatology',
        symptoms: 'Skin irritation, itching',
        notes: 'Chronic condition',
        priority: 'Medium',
        status: 'Scheduled',
        room: 'Exam Room 3',
        durationMins: 30,
      },
    ]);
    console.log(`${appointments.length} appointments created`);

    // Create tasks
    console.log('Creating tasks...');
    const tasks = await Task.create([
      {
        taskId: 'TSK001',
        title: 'Review lab results for Max',
        description: 'Review blood work results from wellness exam',
        assignedTo: veterinarians[0]._id,
        priority: 'Medium',
        category: 'Clinical',
        dueDate: tomorrow,
        status: 'Pending',
        createdBy: 'admin@vetops.com',
        notes: 'Results uploaded to system',
      },
      {
        taskId: 'TSK002',
        title: 'Prepare surgical suite for Bella',
        description: 'Ensure all surgical equipment is sterilized and ready',
        assignedTo: veterinarians[1]._id,
        priority: 'High',
        category: 'Clinical',
        dueDate: today,
        status: 'In Progress',
        createdBy: 'admin@vetops.com',
        notes: 'Spay procedure scheduled for 10:30',
      },
      {
        taskId: 'TSK003',
        title: 'Update patient records',
        description: 'Update all patient records from yesterday\'s emergency cases',
        assignedTo: veterinarians[2]._id,
        priority: 'Low',
        category: 'Administrative',
        dueDate: tomorrow,
        status: 'Pending',
        createdBy: 'admin@vetops.com',
      },
      {
        taskId: 'TSK004',
        title: 'Order medication supplies',
        description: 'Restock anesthesia and pain medication inventory',
        assignedTo: veterinarians[3]._id,
        priority: 'Critical',
        category: 'Administrative',
        dueDate: today,
        status: 'Pending',
        createdBy: 'admin@vetops.com',
        notes: 'Running low on key medications',
      },
      {
        taskId: 'TSK005',
        title: 'Follow up with Charlie\'s owner',
        description: 'Call owner to discuss treatment plan and follow-up care',
        assignedTo: veterinarians[2]._id,
        priority: 'Medium',
        category: 'Communication',
        dueDate: today,
        status: 'Completed',
        createdBy: 'admin@vetops.com',
      },
    ]);
    console.log(`${tasks.length} tasks created`);

    // Create predictions
    console.log('Creating predictions...');
    const predictions = await Prediction.create([
      {
        predictionId: 'PRD001',
        animalName: 'Max',
        species: 'Dog',
        breed: 'Golden Retriever',
        age: 5,
        weight: 32,
        gender: 'Male',
        symptoms: 'Lethargy, decreased appetite',
        medicalHistory: 'Previous hip surgery',
        currentMedications: 'Carprofen for joint pain',
        bodyTemperature: 101.5,
        heartRate: 85,
        respiratoryRate: 20,
        laboratoryResults: 'Mildly elevated liver enzymes',
        aiResult: {
          possibleConditions: [
            { condition: 'Hepatopathy', likelihood: 0.65 },
            { condition: 'Gastrointestinal issue', likelihood: 0.25 },
            { condition: 'Arthritis flare', likelihood: 0.10 },
          ],
          riskLevel: 'Medium',
          confidenceScore: 78,
          recommendedTests: ['Liver function panel', 'Abdominal ultrasound'],
          immediateCareSuggestions: ['Monitor appetite', 'Continue current medications'],
          recommendedTreatments: ['Dietary modification', 'Liver support supplements'],
          followUpAdvice: 'Re-evaluate in 2 weeks if symptoms persist',
          preventiveRecommendations: ['Regular exercise', 'Weight management'],
          aiExplanation: 'Based on the combination of lethargy, decreased appetite, and mildly elevated liver enzymes in a dog with a history of carprofen use, there is a moderate likelihood of medication-induced hepatopathy.',
        },
        createdBy: 'admin@vetops.com',
      },
      {
        predictionId: 'PRD002',
        animalName: 'Whiskers',
        species: 'Cat',
        breed: 'Domestic Shorthair',
        age: 8,
        weight: 4.5,
        gender: 'Female',
        symptoms: 'Increased thirst, frequent urination',
        medicalHistory: 'None significant',
        currentMedications: 'None',
        bodyTemperature: 101.2,
        heartRate: 160,
        respiratoryRate: 30,
        laboratoryResults: 'Elevated blood glucose',
        aiResult: {
          possibleConditions: [
            { condition: 'Diabetes Mellitus', likelihood: 0.85 },
            { condition: 'Chronic kidney disease', likelihood: 0.10 },
            { condition: 'Hyperthyroidism', likelihood: 0.05 },
          ],
          riskLevel: 'High',
          confidenceScore: 85,
          recommendedTests: ['Fructosamine level', 'Urinalysis', 'T4 level'],
          immediateCareSuggestions: ['Immediate blood glucose monitoring', 'Water access'],
          recommendedTreatments: ['Insulin therapy (pending confirmation)', 'Dietary management'],
          followUpAdvice: 'Daily glucose curve recommended',
          preventiveRecommendations: ['Weight control', 'Regular monitoring'],
          aiExplanation: 'The classic presentation of polydipsia and polyuria with hyperglycemia strongly suggests diabetes mellitus. The high confidence score reflects the clear clinical presentation.',
        },
        createdBy: 'admin@vetops.com',
      },
      {
        predictionId: 'PRD003',
        animalName: 'Buddy',
        species: 'Dog',
        breed: 'Labrador Retriever',
        age: 3,
        weight: 38,
        gender: 'Male',
        symptoms: 'Limping on right hind leg',
        medicalHistory: 'None',
        currentMedications: 'None',
        bodyTemperature: 101.0,
        heartRate: 80,
        respiratoryRate: 18,
        laboratoryResults: 'Normal',
        aiResult: {
          possibleConditions: [
            { condition: 'Cranial cruciate ligament tear', likelihood: 0.70 },
            { condition: 'Soft tissue injury', likelihood: 0.20 },
            { condition: 'Hip dysplasia', likelihood: 0.10 },
          ],
          riskLevel: 'Medium',
          confidenceScore: 72,
          recommendedTests: ['Orthopedic examination', 'Radiographs of stifle'],
          immediateCareSuggestions: ['Rest and restricted activity', 'Anti-inflammatory if prescribed'],
          recommendedTreatments: ['Surgical repair if CCL confirmed', 'Physical therapy'],
          followUpAdvice: 'Re-evaluate in 1 week',
          preventiveRecommendations: ['Weight management', 'Controlled exercise'],
          aiExplanation: 'In a young large breed dog presenting with acute hind limb lameness, cranial cruciate ligament injury is the most common diagnosis. The breed predisposition supports this assessment.',
        },
        createdBy: 'admin@vetops.com',
      },
    ]);
    console.log(`${predictions.length} predictions created`);

    // Create notifications
    console.log('Creating notifications...');
    const notifications = await Notification.create([
      {
        notificationId: 'NOT001',
        title: 'New appointment scheduled',
        message: 'Max (Golden Retriever) has a wellness exam scheduled for today at 9:00 AM',
        type: 'info',
        priority: 'medium',
        module: 'appointments',
        read: false,
        recipient: admin._id,
        relatedId: appointments[0]._id,
      },
      {
        notificationId: 'NOT002',
        title: 'Surgery in progress',
        message: 'Bella\'s spay procedure is currently in progress in Surgery Room 1',
        type: 'warning',
        priority: 'high',
        module: 'appointments',
        read: false,
        recipient: admin._id,
        relatedId: appointments[1]._id,
      },
      {
        notificationId: 'NOT003',
        title: 'Task assigned',
        message: 'You have been assigned to review lab results for Max',
        type: 'info',
        priority: 'medium',
        module: 'tasks',
        read: true,
        recipient: veterinarians[0]._id,
        relatedId: tasks[0]._id,
      },
      {
        notificationId: 'NOT004',
        title: 'Critical task pending',
        message: 'Order medication supplies - inventory running low',
        type: 'error',
        priority: 'high',
        module: 'tasks',
        read: false,
        recipient: admin._id,
        relatedId: tasks[3]._id,
      },
      {
        notificationId: 'NOT005',
        title: 'AI prediction completed',
        message: 'AI analysis for Max has been completed with Medium risk level',
        type: 'success',
        priority: 'medium',
        module: 'predictions',
        read: false,
        recipient: admin._id,
        relatedId: predictions[0]._id,
      },
      {
        notificationId: 'NOT006',
        title: 'System update',
        message: 'System maintenance scheduled for tonight at 11:00 PM',
        type: 'info',
        priority: 'low',
        module: 'system',
        read: true,
        recipient: admin._id,
      },
    ]);
    console.log(`${notifications.length} notifications created`);

    // Create audit logs
    console.log('Creating audit logs...');
    const auditLogs = await AuditLog.create([
      {
        auditId: 'AUD001',
        user: admin._id,
        action: 'login',
        module: 'auth',
        resourceId: admin._id.toString(),
        description: 'Admin user logged in',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      {
        auditId: 'AUD002',
        user: admin._id,
        action: 'create',
        module: 'appointments',
        resourceId: appointments[0]._id.toString(),
        description: 'Created new appointment for Max',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      {
        auditId: 'AUD003',
        user: admin._id,
        action: 'create',
        module: 'veterinarians',
        resourceId: veterinarians[0]._id.toString(),
        description: 'Created new veterinarian Dr. Sarah Johnson',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      {
        auditId: 'AUD004',
        user: admin._id,
        action: 'update',
        module: 'tasks',
        resourceId: tasks[1]._id.toString(),
        description: 'Updated task status to In Progress',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      {
        auditId: 'AUD005',
        user: admin._id,
        action: 'create',
        module: 'predictions',
        resourceId: predictions[0]._id.toString(),
        description: 'Generated AI prediction for Max',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    ]);
    console.log(`${auditLogs.length} audit logs created`);

    console.log('\n=== Database seeding completed successfully ===');
    console.log('\nSummary:');
    console.log(`- Admin users: 1`);
    console.log(`- Veterinarians: ${veterinarians.length}`);
    console.log(`- Appointments: ${appointments.length}`);
    console.log(`- Tasks: ${tasks.length}`);
    console.log(`- Predictions: ${predictions.length}`);
    console.log(`- Notifications: ${notifications.length}`);
    console.log(`- Audit logs: ${auditLogs.length}`);
    console.log('\nLogin credentials:');
    console.log('Email: admin@vetops.com');
    console.log('Password: admin123');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
