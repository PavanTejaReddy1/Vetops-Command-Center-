import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from '../src/models/User.model.js';
import { Veterinarian } from '../src/models/Veterinarian.model.js';
import { Appointment } from '../src/models/Appointment.model.js';
import { Task } from '../src/models/Task.model.js';
import { Prediction } from '../src/models/Prediction.model.js';
import { Notification } from '../src/models/Notification.model.js';
import { AuditLog } from '../src/models/AuditLog.model.js';
import { AIReview } from '../src/models/AIReview.model.js';
import { Setting } from '../src/models/Setting.model.js';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }

const today = new Date();
const d = (offset) => { const dt = new Date(today); dt.setDate(dt.getDate() + offset); return dt; };
const h = (date, hour, min = 0) => { const dt = new Date(date); dt.setHours(hour, min, 0, 0); return dt; };

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    console.log('Clearing existing data...');
    await Promise.all([
      Appointment.deleteMany({}), Task.deleteMany({}), Prediction.deleteMany({}),
      Notification.deleteMany({}), AuditLog.deleteMany({}), AIReview.deleteMany({}),
      Setting.deleteMany({}), Veterinarian.deleteMany({}), User.deleteMany({}),
    ]);
    console.log('Data cleared. Seeding...');

    // ── USERS ──────────────────────────────────────────────────────────────
    const users = await User.create([
      { email: 'admin@vetops.com', password: 'admin123', firstName: 'Admin', lastName: 'User', role: 'admin', jobTitle: 'System Administrator', isActive: true },
      { email: 'manager@vetops.com', password: 'manager123', firstName: 'Rachel', lastName: 'Morgan', role: 'manager', jobTitle: 'Operations Manager', department: 'Operations', isActive: true },
      { email: 'analyst@vetops.com', password: 'analyst123', firstName: 'Derek', lastName: 'Sullivan', role: 'analyst', jobTitle: 'Data Analyst', department: 'Analytics', isActive: true },
      { email: 'receptionist@vetops.com', password: 'recept123', firstName: 'Priya', lastName: 'Shah', role: 'receptionist', jobTitle: 'Front Desk Receptionist', department: 'Front Desk', isActive: true },
      { email: 'staff@vetops.com', password: 'staff123', firstName: 'Jordan', lastName: 'Blake', role: 'field_staff', jobTitle: 'Veterinary Technician', department: 'Surgery', isActive: true },
      { email: 'inactive@vetops.com', password: 'inactive123', firstName: 'Tom', lastName: 'Gray', role: 'field_staff', jobTitle: 'Kennel Assistant', department: 'Kennel', isActive: false },
    ]);
    console.log(`✓ ${users.length} users created`);
    const adminUser = users[0];

    // ── VETERINARIANS ──────────────────────────────────────────────────────
    const vets = await Veterinarian.create([
      { fullName: 'Dr. Sarah Johnson', employeeId: 'VET001', email: 'sarah.johnson@vetops.com', phone: '+1-555-0101', specialization: 'General Practice', qualification: 'DVM', yearsOfExperience: 8, department: 'Outpatient', status: 'Active', availability: 'Available' },
      { fullName: 'Dr. Michael Chen', employeeId: 'VET002', email: 'michael.chen@vetops.com', phone: '+1-555-0102', specialization: 'Surgery', qualification: 'DVM, DACVS', yearsOfExperience: 12, department: 'Surgery', status: 'Active', availability: 'Busy' },
      { fullName: 'Dr. Emily Rodriguez', employeeId: 'VET003', email: 'emily.rodriguez@vetops.com', phone: '+1-555-0103', specialization: 'Emergency & Critical Care', qualification: 'DVM, DACVECC', yearsOfExperience: 6, department: 'Emergency', status: 'Active', availability: 'Available' },
      { fullName: 'Dr. James Wilson', employeeId: 'VET004', email: 'james.wilson@vetops.com', phone: '+1-555-0104', specialization: 'Internal Medicine', qualification: 'DVM, DACVIM', yearsOfExperience: 15, department: 'Internal Medicine', status: 'Active', availability: 'Available' },
      { fullName: 'Dr. Lisa Thompson', employeeId: 'VET005', email: 'lisa.thompson@vetops.com', phone: '+1-555-0105', specialization: 'Dermatology', qualification: 'DVM, DACVD', yearsOfExperience: 7, department: 'Outpatient', status: 'On Leave', availability: 'Off Duty' },
      { fullName: 'Dr. Marcus Webb', employeeId: 'VET006', email: 'marcus.webb@vetops.com', phone: '+1-555-0106', specialization: 'Cardiology', qualification: 'DVM, DACVIM(Cardiology)', yearsOfExperience: 10, department: 'Internal Medicine', status: 'Active', availability: 'Available' },
      { fullName: 'Dr. Priya Nair', employeeId: 'VET007', email: 'priya.nair@vetops.com', phone: '+1-555-0107', specialization: 'Oncology', qualification: 'DVM, DACVIM(Oncology)', yearsOfExperience: 9, department: 'Internal Medicine', status: 'Active', availability: 'Busy' },
      { fullName: 'Dr. Owen Fisher', employeeId: 'VET008', email: 'owen.fisher@vetops.com', phone: '+1-555-0108', specialization: 'Neurology', qualification: 'DVM, DACVIM(Neurology)', yearsOfExperience: 11, department: 'Diagnostic', status: 'Active', availability: 'Available' },
    ]);
    console.log(`✓ ${vets.length} veterinarians created`);

    // ── APPOINTMENTS ───────────────────────────────────────────────────────
    const appts = await Appointment.create([
      { appointmentId: 'APT001', petName: 'Max', animalType: 'Dog', breed: 'Golden Retriever', ownerName: 'John Smith', ownerPhone: '+1-555-1001', veterinarian: vets[0]._id, appointmentDate: h(today, 9), appointmentTime: '09:00', visitType: 'Wellness Exam', symptoms: 'Annual checkup, vaccines due', priority: 'Medium', status: 'Scheduled', room: 'Exam Room 1', durationMins: 30 },
      { appointmentId: 'APT002', petName: 'Bella', animalType: 'Cat', breed: 'Persian', ownerName: 'Jane Doe', ownerPhone: '+1-555-1002', veterinarian: vets[1]._id, appointmentDate: h(today, 10, 30), appointmentTime: '10:30', visitType: 'Surgery', symptoms: 'Spay procedure', notes: 'Pre-surgical bloodwork completed', priority: 'High', status: 'In Progress', room: 'Surgery Room 1', durationMins: 90 },
      { appointmentId: 'APT003', petName: 'Charlie', animalType: 'Dog', breed: 'German Shepherd', ownerName: 'Bob Johnson', ownerPhone: '+1-555-1003', veterinarian: vets[2]._id, appointmentDate: h(d(-1), 14), appointmentTime: '14:00', visitType: 'Emergency', symptoms: 'Vomiting, lethargy, possible toxin ingestion', priority: 'Emergency', status: 'Completed', room: 'Emergency Room 1', durationMins: 60 },
      { appointmentId: 'APT004', petName: 'Luna', animalType: 'Cat', breed: 'Siamese', ownerName: 'Alice Brown', ownerPhone: '+1-555-1004', veterinarian: vets[0]._id, appointmentDate: h(d(1), 11), appointmentTime: '11:00', visitType: 'Vaccination', symptoms: 'Annual vaccinations', priority: 'Low', status: 'Scheduled', room: 'Exam Room 2', durationMins: 20 },
      { appointmentId: 'APT005', petName: 'Rocky', animalType: 'Dog', breed: 'Bulldog', ownerName: 'Tom Wilson', ownerPhone: '+1-555-1005', veterinarian: vets[3]._id, appointmentDate: h(today, 15), appointmentTime: '15:00', visitType: 'Dermatology', symptoms: 'Chronic skin irritation, itching, hair loss', priority: 'Medium', status: 'Scheduled', room: 'Exam Room 3', durationMins: 30 },
      { appointmentId: 'APT006', petName: 'Whiskers', animalType: 'Cat', breed: 'Domestic Shorthair', ownerName: 'Susan Lee', ownerPhone: '+1-555-1006', veterinarian: vets[5]._id, appointmentDate: h(today, 8), appointmentTime: '08:00', visitType: 'Cardiology', symptoms: 'Heart murmur detected at last visit', priority: 'High', status: 'Completed', room: 'Cardiology Suite', durationMins: 45 },
      { appointmentId: 'APT007', petName: 'Buddy', animalType: 'Dog', breed: 'Labrador Retriever', ownerName: 'Mike Davis', ownerPhone: '+1-555-1007', veterinarian: vets[3]._id, appointmentDate: h(d(2), 10), appointmentTime: '10:00', visitType: 'Follow-up', symptoms: 'Post-op check after knee surgery', priority: 'Medium', status: 'Scheduled', room: 'Exam Room 1', durationMins: 30 },
      { appointmentId: 'APT008', petName: 'Cleo', animalType: 'Cat', breed: 'Bengal', ownerName: 'Emma Wilson', ownerPhone: '+1-555-1008', veterinarian: vets[6]._id, appointmentDate: h(d(-2), 9, 30), appointmentTime: '09:30', visitType: 'Other', symptoms: 'Weight loss, increased thirst', priority: 'High', status: 'Completed', room: 'Exam Room 4', durationMins: 45 },
      { appointmentId: 'APT009', petName: 'Shadow', animalType: 'Dog', breed: 'Border Collie', ownerName: 'David Kim', ownerPhone: '+1-555-1009', veterinarian: vets[7]._id, appointmentDate: h(d(1), 14), appointmentTime: '14:00', visitType: 'Other', symptoms: 'Seizure activity, possible epilepsy', priority: 'High', status: 'Scheduled', room: 'Neurology Suite', durationMins: 60 },
      { appointmentId: 'APT010', petName: 'Pepper', animalType: 'Bird', breed: 'African Grey', ownerName: 'Sarah Connor', ownerPhone: '+1-555-1010', veterinarian: vets[0]._id, appointmentDate: h(today, 13), appointmentTime: '13:00', visitType: 'Wellness Exam', symptoms: 'Annual check, feather condition', priority: 'Low', status: 'In Progress', room: 'Exam Room 2', durationMins: 20 },
      { appointmentId: 'APT011', petName: 'Nala', animalType: 'Dog', breed: 'Doberman', ownerName: 'James Carter', ownerPhone: '+1-555-1011', veterinarian: vets[5]._id, appointmentDate: h(d(-3), 11), appointmentTime: '11:00', visitType: 'Cardiology', symptoms: 'Dilated cardiomyopathy monitoring', priority: 'High', status: 'Completed', room: 'Cardiology Suite', durationMins: 60 },
      { appointmentId: 'APT012', petName: 'Milo', animalType: 'Dog', breed: 'Poodle', ownerName: 'Linda Park', ownerPhone: '+1-555-1012', veterinarian: vets[1]._id, appointmentDate: h(d(3), 9), appointmentTime: '09:00', visitType: 'Dental', symptoms: 'Dental cleaning and scaling', priority: 'Low', status: 'Scheduled', room: 'Surgery Room 2', durationMins: 60 },
      { appointmentId: 'APT013', petName: 'Zara', animalType: 'Cat', breed: 'Maine Coon', ownerName: 'Chris Moore', ownerPhone: '+1-555-1013', veterinarian: vets[2]._id, appointmentDate: h(d(-1), 16), appointmentTime: '16:00', visitType: 'Emergency', symptoms: 'Urinary blockage — critical', priority: 'Emergency', status: 'Completed', room: 'Emergency Room 2', durationMins: 90 },
      { appointmentId: 'APT014', petName: 'Oscar', animalType: 'Small Mammal', breed: 'Rabbit', ownerName: 'Nancy White', ownerPhone: '+1-555-1014', veterinarian: vets[0]._id, appointmentDate: h(d(1), 15, 30), appointmentTime: '15:30', visitType: 'Vaccination', symptoms: 'RHDV2 and myxomatosis vaccines', priority: 'Low', status: 'Scheduled', room: 'Exam Room 3', durationMins: 15 },
      { appointmentId: 'APT015', petName: 'Diesel', animalType: 'Dog', breed: 'Rottweiler', ownerName: 'Brian Young', ownerPhone: '+1-555-1015', veterinarian: vets[3]._id, appointmentDate: h(d(-4), 10), appointmentTime: '10:00', visitType: 'Other', symptoms: 'Chronic vomiting, weight loss', notes: 'IBD suspected — referred to Internal Medicine', priority: 'High', status: 'Completed', room: 'Exam Room 5', durationMins: 45 },
    ]);
    console.log(`✓ ${appts.length} appointments created`);

    // ── TASKS ──────────────────────────────────────────────────────────────
    const tasks = await Task.create([
      { taskId: 'TSK001', title: 'Review lab results for Max', description: 'Review blood work from wellness exam and update patient record', assignedTo: vets[0]._id, priority: 'Medium', category: 'Clinical', dueDate: d(1), status: 'Pending', createdBy: 'admin@vetops.com', notes: 'Results uploaded to system' },
      { taskId: 'TSK002', title: 'Prepare surgical suite for Bella', description: 'Sterilize all surgical equipment and check anesthesia supplies', assignedTo: vets[1]._id, priority: 'High', category: 'Clinical', dueDate: today, status: 'In Progress', createdBy: 'admin@vetops.com' },
      { taskId: 'TSK003', title: 'Update emergency case records', description: 'Document all patient records from emergency cases in the last 24 hours', assignedTo: vets[2]._id, priority: 'Low', category: 'Administrative', dueDate: d(1), status: 'Pending', createdBy: 'admin@vetops.com' },
      { taskId: 'TSK004', title: 'Order medication supplies', description: 'Restock anesthesia, pain medication and antibiotics — running critically low', assignedTo: vets[3]._id, priority: 'Critical', category: 'Administrative', dueDate: today, status: 'Pending', createdBy: 'admin@vetops.com', notes: 'Contact supplier ref: MED-SUPP-2026' },
      { taskId: 'TSK005', title: 'Follow up with Charlie\'s owner', description: 'Call owner to discuss discharge instructions and follow-up care plan', assignedTo: vets[2]._id, priority: 'Medium', category: 'Communication', dueDate: today, status: 'Completed', createdBy: 'admin@vetops.com' },
      { taskId: 'TSK006', title: 'Cardiac monitoring report — Nala', description: 'Compile 90-day cardiac monitoring data and prepare specialist referral', assignedTo: vets[5]._id, priority: 'High', category: 'Clinical', dueDate: d(2), status: 'In Progress', createdBy: 'manager@vetops.com' },
      { taskId: 'TSK007', title: 'Equipment maintenance — X-ray machine', description: 'Schedule and oversee annual X-ray machine calibration and safety check', assignedTo: vets[7]._id, priority: 'Medium', category: 'Maintenance', dueDate: d(5), status: 'Pending', createdBy: 'admin@vetops.com' },
      { taskId: 'TSK008', title: 'Staff training — new anaesthesia protocol', description: 'Coordinate and conduct mandatory training session for surgical team', assignedTo: vets[1]._id, priority: 'High', category: 'Administrative', dueDate: d(7), status: 'Pending', createdBy: 'manager@vetops.com' },
      { taskId: 'TSK009', title: 'Update vaccination reminders', description: 'Send SMS and email reminders to all patients with vaccines due this month', assignedTo: vets[0]._id, priority: 'Low', category: 'Communication', dueDate: d(3), status: 'Pending', createdBy: 'receptionist@vetops.com' },
      { taskId: 'TSK010', title: 'Kennel deep clean — Ward B', description: 'Complete disinfection of Ward B kennels following ringworm case', assignedTo: vets[4]._id, priority: 'Critical', category: 'Maintenance', dueDate: today, status: 'Pending', createdBy: 'admin@vetops.com', notes: 'Use protocol CP-7 for ringworm decontamination' },
      { taskId: 'TSK011', title: 'Compile monthly performance report', description: 'Gather KPI data and prepare monthly operations report for board review', assignedTo: vets[3]._id, priority: 'Medium', category: 'Administrative', dueDate: d(10), status: 'Pending', createdBy: 'manager@vetops.com' },
      { taskId: 'TSK012', title: 'Oncology consult preparation — Cleo', description: 'Prepare all imaging and biopsy results for oncology consultation', assignedTo: vets[6]._id, priority: 'High', category: 'Clinical', dueDate: d(1), status: 'In Progress', createdBy: 'admin@vetops.com' },
    ]);
    console.log(`✓ ${tasks.length} tasks created`);

    // ── PREDICTIONS ────────────────────────────────────────────────────────
    const predictions = await Prediction.create([
      {
        predictionId: 'PRD001', animalName: 'Max', species: 'Dog', breed: 'Golden Retriever', age: 5, weight: 32, gender: 'Male',
        symptoms: 'Lethargy, decreased appetite, mild jaundice', medicalHistory: 'Previous hip surgery 2 years ago', currentMedications: 'Carprofen 75mg daily',
        bodyTemperature: 101.5, heartRate: 85, respiratoryRate: 20, laboratoryResults: 'Mildly elevated ALT and AST, normal bilirubin',
        aiResult: { possibleConditions: [{ condition: 'Drug-induced hepatopathy', likelihood: 0.65 }, { condition: 'Gastrointestinal disorder', likelihood: 0.25 }, { condition: 'Arthritis flare', likelihood: 0.10 }], riskLevel: 'Medium', confidenceScore: 78, recommendedTests: ['Liver function panel', 'Abdominal ultrasound', 'Bile acids test'], immediateCareSuggestions: ['Monitor food and water intake', 'Reduce Carprofen dose pending workup'], recommendedTreatments: ['Liver support supplements (SAMe)', 'Dietary modification to low-fat diet'], followUpAdvice: 'Re-evaluate liver enzymes in 2 weeks. If ALT >3x normal, discontinue Carprofen.', preventiveRecommendations: ['Regular liver monitoring every 6 months', 'Weight management program'], aiExplanation: 'Lethargy and elevated liver enzymes in a patient on long-term NSAID therapy (Carprofen) suggests medication-induced hepatopathy. The combination of clinical signs and lab findings supports this as the primary differential.' },
        createdBy: 'admin@vetops.com',
      },
      {
        predictionId: 'PRD002', animalName: 'Whiskers', species: 'Cat', breed: 'Domestic Shorthair', age: 8, weight: 4.5, gender: 'Female',
        symptoms: 'Polydipsia (increased thirst), polyuria, weight loss despite good appetite', medicalHistory: 'Previously healthy', currentMedications: 'None',
        bodyTemperature: 101.2, heartRate: 160, respiratoryRate: 30, laboratoryResults: 'Blood glucose 380 mg/dL, glycosuria present',
        aiResult: { possibleConditions: [{ condition: 'Diabetes Mellitus (Type 2)', likelihood: 0.85 }, { condition: 'Hyperthyroidism', likelihood: 0.10 }, { condition: 'Chronic kidney disease', likelihood: 0.05 }], riskLevel: 'High', confidenceScore: 92, recommendedTests: ['Fructosamine level', 'Full urinalysis with culture', 'T4 thyroid panel', 'Blood pressure measurement'], immediateCareSuggestions: ['Begin dietary management (low-carb food)', 'Monitor glucose curve', 'Ensure fresh water available'], recommendedTreatments: ['Insulin therapy (Glargine 1-2 IU SC BID)', 'High-protein low-carbohydrate diet'], followUpAdvice: 'Daily glucose curves for first 2 weeks. Adjust insulin dose based on nadir glucose. Target nadir 80-150 mg/dL.', preventiveRecommendations: ['Weight control program', 'Monthly glucose monitoring once stabilised', 'Annual thyroid screening'], aiExplanation: 'Classic diabetic triad (PU/PD/weight loss) combined with marked hyperglycemia (380 mg/dL) and glycosuria strongly indicates Diabetes Mellitus. High confidence reflects clear clinical and laboratory evidence.' },
        createdBy: 'admin@vetops.com',
      },
      {
        predictionId: 'PRD003', animalName: 'Buddy', species: 'Dog', breed: 'Labrador Retriever', age: 3, weight: 38, gender: 'Male',
        symptoms: 'Acute non-weight-bearing lameness on right hind limb, stifle effusion', medicalHistory: 'No prior orthopaedic issues', currentMedications: 'None',
        bodyTemperature: 101.0, heartRate: 80, respiratoryRate: 18, laboratoryResults: 'Normal CBC, mild joint fluid on aspiration',
        aiResult: { possibleConditions: [{ condition: 'Cranial cruciate ligament (CCL) rupture', likelihood: 0.72 }, { condition: 'Meniscal injury', likelihood: 0.18 }, { condition: 'Stifle OCD', likelihood: 0.10 }], riskLevel: 'Medium', confidenceScore: 74, recommendedTests: ['Radiographs of bilateral stifles', 'Drawer test under sedation', 'Tibial compression test', 'MRI if equivocal'], immediateCareSuggestions: ['Strict exercise restriction', 'Meloxicam 0.1 mg/kg SID with food', 'Padded bedding'], recommendedTreatments: ['TPLO surgery (gold standard for large breeds)', 'Post-operative physical rehabilitation'], followUpAdvice: 'Surgery consultation within 7 days to prevent meniscal injury progression. Radiographs before referral.', preventiveRecommendations: ['Weight management (body condition score target 4-5/9)', 'Controlled exercise post-recovery', 'Joint supplements (omega-3, glucosamine)'], aiExplanation: 'Young large-breed male dog with acute hind limb lameness, stifle effusion, and positive cranial drawer sign is highly suggestive of CCL rupture. Breed predisposition (Labrador) and age profile support this assessment.' },
        createdBy: 'admin@vetops.com',
      },
      {
        predictionId: 'PRD004', animalName: 'Cleo', species: 'Cat', breed: 'Bengal', age: 6, weight: 4.2, gender: 'Female',
        symptoms: 'Progressive weight loss over 3 months, occasional vomiting, enlarged mesenteric lymph nodes', medicalHistory: 'Vomiting episodes started 6 months ago', currentMedications: 'None',
        bodyTemperature: 102.8, heartRate: 200, respiratoryRate: 35, laboratoryResults: 'Elevated globulins, mild anaemia, lymph node aspirate shows lymphoblasts',
        aiResult: { possibleConditions: [{ condition: 'High-grade alimentary lymphoma', likelihood: 0.78 }, { condition: 'Small cell (low-grade) lymphoma', likelihood: 0.15 }, { condition: 'Inflammatory bowel disease', likelihood: 0.07 }], riskLevel: 'Critical', confidenceScore: 88, recommendedTests: ['Abdominal ultrasound with guided biopsy', 'Flow cytometry on lymph node aspirate', 'Full-body CT scan', 'Bone marrow aspirate'], immediateCareSuggestions: ['Hospitalise for fluid support', 'Nutritional support (NG tube if needed)', 'Pain management'], recommendedTreatments: ['CHOP-based chemotherapy protocol', 'Prednisolone pending histopathology results', 'Oncology specialist referral urgently'], followUpAdvice: 'Urgent oncology consultation within 48 hours. Prognosis guarded to poor for high-grade lymphoma without treatment.', preventiveRecommendations: ['Annual abdominal ultrasound for high-risk breeds', 'Monitor for GI symptoms'], aiExplanation: 'Combination of progressive weight loss, GI signs, palpable lymphadenopathy, elevated globulins, anaemia, and lymphoblasts on aspirate strongly indicates lymphoma. Critical risk reflects guarded prognosis and urgent treatment need.' },
        createdBy: 'analyst@vetops.com',
      },
    ]);
    console.log(`✓ ${predictions.length} predictions created`);

    // ── AI REVIEWS ─────────────────────────────────────────────────────────
    const aiReviews = await AIReview.create([
      { reviewId: 'AIR001', title: 'Emergency capacity projected to exceed threshold by 2:00 PM', description: 'Emergency intake rate is trending 34% above the 4-week average. ER may reach full capacity within 3 hours.', severity: 'critical', module: 'capacity', confidence: 88, status: 'pending', recommendation: 'Open overflow ER bay and call in on-call emergency veterinarian now.', expectedImpact: 'Reduces average ER wait from projected 85 min to under 30 min.', assumptions: 'On-call staff is available and overflow bay can be operational within 45 minutes.', constraints: 'Requires Operations Manager approval to open overflow bay.', aiExplanation: 'Historical data shows Tuesday afternoons have the highest emergency intake rate. Current intake velocity exceeds all 4-week comparables.', modelVersion: 'llama3-70b-8192', predictedFor: h(today, 14), sourceData: { currentEmergencies: 8, capacity: 6, trendIncrease: '34%' } },
      { reviewId: 'AIR002', title: 'Dr. Marcus Webb approaching sustained overutilisation', description: 'Dr. Webb\'s utilisation has remained above 95% for 3 consecutive shifts. Fatigue risk is elevated.', severity: 'watch', module: 'tasks', confidence: 76, status: 'pending', recommendation: 'Redistribute 2 non-urgent appointments to Dr. James Wilson or Dr. Sarah Johnson for the afternoon shift.', expectedImpact: 'Reduces Dr. Webb\'s utilisation to ~78%, within safe operational limits.', assumptions: 'Wilson and Johnson have capacity in their schedules.', constraints: 'Patient preferences and appointment type compatibility must be checked before reassignment.', aiExplanation: 'Sustained utilisation above 90% over multiple shifts correlates with increased error rate and staff burnout in veterinary settings.', modelVersion: 'llama3-70b-8192', predictedFor: h(today, 18), sourceData: { utilisation: '95%', consecutiveShifts: 3 } },
      { reviewId: 'AIR003', title: 'Exam Room 2 turnover time trending upward — SLA at risk', description: 'Average room turnover in Exam Room 2 has increased from 9 to 17 minutes over the past 7 days, approaching SLA threshold.', severity: 'watch', module: 'appointments', confidence: 71, status: 'approved', recommendation: 'Assign additional technician to Exam Room 2 turnovers during 10am–2pm peak window.', expectedImpact: 'Returns average turnover to under 10 minutes, keeping within SLA.', assumptions: 'A spare technician can be redeployed from the reception/prep area.', constraints: 'Redeployment subject to current technician workload.', aiExplanation: 'Turnover data shows consistent increase this week. If trend continues at current rate, SLA breach will occur by Friday.', modelVersion: 'llama3-70b-8192', reviewedBy: adminUser._id, reviewedAt: new Date(), reviewNote: 'Approved — Jordan Blake reassigned to assist in Exam Room 2.', predictedFor: h(today, 12) },
      { reviewId: 'AIR004', title: 'Vaccination demand expected to spike next week', description: 'Seasonal pattern analysis predicts a 20-25% increase in vaccination bookings starting next Monday.', severity: 'info', module: 'forecasts', confidence: 64, status: 'pending', recommendation: 'Pre-stock rabies, DHPP and FVRCP vaccines 3 days in advance. Consider adding one vaccination clinic slot per day.', expectedImpact: 'Prevents supply shortfall and reduces booking wait time.', assumptions: 'Seasonal pattern from prior 3 years holds. Supplier can fulfil order within 3 days.', constraints: 'Budget approval needed for pre-stock order above standard threshold.', aiExplanation: 'Vaccination bookings historically spike 4-6 weeks after school holidays. Current calendar alignment matches prior peak periods.', modelVersion: 'llama3-70b-8192', predictedFor: d(7) },
      { reviewId: 'AIR005', title: 'High-risk AI prediction (Cleo) requires immediate clinical review', description: 'Prediction PRD004 flagged Critical risk for Cleo (Bengal cat) — suspected high-grade lymphoma. No clinical action taken yet.', severity: 'critical', module: 'predictions', confidence: 88, status: 'rejected', recommendation: 'Schedule urgent oncology consultation within 48 hours and begin supportive care protocol.', expectedImpact: 'Early intervention significantly improves treatment response probability.', assumptions: 'Oncology specialist is available for consultation within 48 hours.', constraints: 'Final clinical decision rests with attending veterinarian.', aiExplanation: 'Critical-risk predictions with confidence ≥85% require same-day clinical review under hospital protocol.', modelVersion: 'llama3-70b-8192', reviewedBy: adminUser._id, reviewedAt: new Date(), reviewNote: 'Rejected — Dr. Nair already initiated consultation directly. Process captured via appointment system.', predictedFor: today },
    ]);
    console.log(`✓ ${aiReviews.length} AI reviews created`);

    // ── NOTIFICATIONS ──────────────────────────────────────────────────────
    const notifications = await Notification.create([
      { notificationId: 'NOT001', title: 'New appointment scheduled', message: 'Max (Golden Retriever) has a wellness exam scheduled for today at 9:00 AM with Dr. Sarah Johnson.', type: 'info', priority: 'medium', module: 'appointments', read: false, recipient: adminUser._id, relatedId: appts[0]._id },
      { notificationId: 'NOT002', title: 'Surgery in progress — Bella', message: "Bella's spay procedure is currently in progress in Surgery Room 1 with Dr. Michael Chen.", type: 'warning', priority: 'high', module: 'appointments', read: false, recipient: adminUser._id, relatedId: appts[1]._id },
      { notificationId: 'NOT003', title: 'Critical task — medication restock', message: 'Medication supplies are critically low. TSK004 requires immediate action.', type: 'error', priority: 'high', module: 'tasks', read: false, recipient: adminUser._id, relatedId: tasks[3]._id },
      { notificationId: 'NOT004', title: 'AI prediction — Critical risk detected', message: 'Cleo (Bengal cat) has been flagged as Critical risk by AI analysis. Review required.', type: 'error', priority: 'high', module: 'predictions', read: false, recipient: adminUser._id, relatedId: predictions[3]._id },
      { notificationId: 'NOT005', title: 'AI review awaiting approval', message: 'Emergency capacity alert (AIR001) is pending your review and decision.', type: 'warning', priority: 'high', module: 'predictions', read: false, recipient: adminUser._id },
      { notificationId: 'NOT006', title: 'AI prediction completed — Max', message: 'AI analysis for Max (Golden Retriever) completed with Medium risk. Confidence: 78%.', type: 'success', priority: 'medium', module: 'predictions', read: true, recipient: adminUser._id, relatedId: predictions[0]._id },
      { notificationId: 'NOT007', title: 'Task completed', message: 'TSK005 (Follow up with Charlie\'s owner) has been marked as completed.', type: 'success', priority: 'low', module: 'tasks', read: true, recipient: adminUser._id, relatedId: tasks[4]._id },
      { notificationId: 'NOT008', title: 'System maintenance scheduled', message: 'Routine system maintenance is scheduled for tonight at 11:00 PM. Expect 15 minutes of downtime.', type: 'info', priority: 'low', module: 'system', read: true, recipient: adminUser._id },
      { notificationId: 'NOT009', title: 'Emergency appointment — Charlie', message: 'Emergency admission: Charlie (German Shepherd) with suspected toxin ingestion. Dr. Rodriguez assigned.', type: 'error', priority: 'high', module: 'appointments', read: true, recipient: adminUser._id, relatedId: appts[2]._id },
      { notificationId: 'NOT010', title: 'Kennel B deep clean overdue', message: 'TSK010 (Kennel Ward B deep clean) is overdue. Protocol CP-7 must be completed before accepting new patients.', type: 'warning', priority: 'high', module: 'tasks', read: false, recipient: adminUser._id, relatedId: tasks[9]._id },
    ]);
    console.log(`✓ ${notifications.length} notifications created`);

    // ── AUDIT LOGS ─────────────────────────────────────────────────────────
    const auditLogs = await AuditLog.create([
      { auditId: 'AUD001', user: adminUser._id, action: 'Logged In', module: 'auth', resourceId: adminUser._id.toString(), description: 'Admin user logged in', ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      { auditId: 'AUD002', user: adminUser._id, action: 'Created', module: 'appointments', resourceId: appts[0]._id.toString(), description: 'Appointment created (APT001 — Max, Wellness Exam)', ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0' },
      { auditId: 'AUD003', user: adminUser._id, action: 'Created', module: 'veterinarians', resourceId: vets[0]._id.toString(), description: 'Veterinarian created: Dr. Sarah Johnson', ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0' },
      { auditId: 'AUD004', user: adminUser._id, action: 'Updated', module: 'tasks', resourceId: tasks[1]._id.toString(), description: 'Task TSK002 status updated to In Progress', ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0' },
      { auditId: 'AUD005', user: adminUser._id, action: 'Created', module: 'predictions', resourceId: predictions[0]._id.toString(), description: 'AI prediction generated for Max (PRD001)', ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0' },
      { auditId: 'AUD006', user: adminUser._id, action: 'Updated', module: 'appointments', resourceId: appts[2]._id.toString(), description: 'Appointment APT003 status updated to Completed', ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0' },
      { auditId: 'AUD007', user: adminUser._id, action: 'Created', module: 'predictions', resourceId: predictions[3]._id.toString(), description: 'AI prediction generated for Cleo — Critical risk flagged (PRD004)', ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0' },
      { auditId: 'AUD008', user: adminUser._id, action: 'Updated', module: 'system', resourceId: 'settings', description: 'System settings updated: notification preferences', ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0' },
    ]);
    console.log(`✓ ${auditLogs.length} audit logs created`);

    // ── SETTINGS ───────────────────────────────────────────────────────────
    await Setting.create([
      { key: 'orgName', category: 'organization', value: 'VetOps Command Center', type: 'string', description: 'Organization name', isPublic: true },
      { key: 'supportEmail', category: 'organization', value: 'support@vetops.com', type: 'string', description: 'Support email address', isPublic: true },
      { key: 'location', category: 'organization', value: '123 Veterinary Drive, San Francisco, CA 94105', type: 'string', description: 'Primary location', isPublic: true },
      { key: 'timezone', category: 'organization', value: 'America/Los_Angeles', type: 'string', description: 'Time zone', isPublic: true },
      { key: 'theme', category: 'appearance', value: 'light', type: 'string', description: 'Theme preference', isPublic: false },
      { key: 'predictiveAlerts', category: 'notifications', value: true, type: 'boolean', description: 'Predictive bottleneck alerts', isPublic: false },
      { key: 'aiReviewReminders', category: 'notifications', value: true, type: 'boolean', description: 'AI review reminders', isPublic: false },
      { key: 'taskAssignmentUpdates', category: 'notifications', value: true, type: 'boolean', description: 'Task assignment updates', isPublic: false },
      { key: 'weeklyReportSummary', category: 'notifications', value: true, type: 'boolean', description: 'Weekly report summary', isPublic: false },
      { key: 'sessionTimeout', category: 'security', value: 60, type: 'number', description: 'Session timeout in minutes', isPublic: false },
      { key: 'requireMFA', category: 'security', value: false, type: 'boolean', description: 'Require multi-factor authentication', isPublic: false },
      { key: 'confidenceThreshold', category: 'ai', value: 0.7, type: 'number', description: 'AI prediction confidence threshold', isPublic: false },
      { key: 'autoApproveLowRisk', category: 'ai', value: false, type: 'boolean', description: 'Auto-approve low risk predictions', isPublic: false },
      { key: 'maintenanceMode', category: 'system', value: false, type: 'boolean', description: 'Maintenance mode', isPublic: false },
      { key: 'apiRateLimit', category: 'system', value: 1000, type: 'number', description: 'API rate limit per hour', isPublic: false },
    ]);
    console.log('✓ Settings created');

    console.log('\n=== Database seeding completed successfully ===');
    console.log('\nSummary:');
    console.log(`  Users:         ${users.length}`);
    console.log(`  Veterinarians: ${vets.length}`);
    console.log(`  Appointments:  ${appts.length}`);
    console.log(`  Tasks:         ${tasks.length}`);
    console.log(`  Predictions:   ${predictions.length}`);
    console.log(`  AI Reviews:    ${aiReviews.length}`);
    console.log(`  Notifications: ${notifications.length}`);
    console.log(`  Audit Logs:    ${auditLogs.length}`);
    console.log('\nLogin credentials:');
    console.log('  Admin:        admin@vetops.com       / admin123');
    console.log('  Manager:      manager@vetops.com     / manager123');
    console.log('  Analyst:      analyst@vetops.com     / analyst123');
    console.log('  Receptionist: receptionist@vetops.com / recept123');
    console.log('  Field Staff:  staff@vetops.com       / staff123');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
