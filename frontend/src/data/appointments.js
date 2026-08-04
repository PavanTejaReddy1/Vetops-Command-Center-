/**
 * Dummy data — Appointments
 * `status` drives the StatusBadge in the Workflow Queue table.
 */
export const appointments = [
  { id: 'apt-1001', animalId: 'ani-001', animalName: 'Biscuit', ownerName: 'Sarah Whitfield', vetId: 'vet-001', vetName: 'Dr. Elena Marsh', type: 'Wellness Exam', room: 'Exam 2', scheduledAt: '2026-08-04T08:30:00', durationMins: 30, status: 'in-progress' },
  { id: 'apt-1002', animalId: 'ani-004', animalName: 'Luna', ownerName: 'James O\u2019Connell', vetId: 'vet-002', vetName: 'Dr. Raj Patel', type: 'Vaccination', room: 'Exam 1', scheduledAt: '2026-08-04T09:00:00', durationMins: 20, status: 'waiting' },
  { id: 'apt-1003', animalId: 'ani-003', animalName: 'Rocky', ownerName: 'Maria Gonzalez', vetId: 'vet-004', vetName: 'Dr. Marcus Webb', type: 'Emergency \u2013 Respiratory Distress', room: 'ER 1', scheduledAt: '2026-08-04T09:10:00', durationMins: 45, status: 'critical' },
  { id: 'apt-1004', animalId: 'ani-002', animalName: 'Shadow', ownerName: 'David Kim', vetId: 'vet-003', vetName: 'Dr. Naomi Cole', type: 'Dermatology Follow-up', room: 'Exam 3', scheduledAt: '2026-08-04T09:30:00', durationMins: 25, status: 'scheduled' },
  { id: 'apt-1005', animalId: 'ani-007', animalName: 'Pepper', ownerName: 'Maria Gonzalez', vetId: 'vet-006', vetName: 'Dr. Owen Fisher', type: 'Post-Op Check', room: 'Exam 4', scheduledAt: '2026-08-04T10:00:00', durationMins: 20, status: 'scheduled' },
  { id: 'apt-1006', animalId: 'ani-005', animalName: 'Max', ownerName: 'Aisha Rahman', vetId: 'vet-004', vetName: 'Dr. Marcus Webb', type: 'Cardiac Workup', room: 'Exam 2', scheduledAt: '2026-08-04T10:15:00', durationMins: 40, status: 'delayed' },
  { id: 'apt-1007', animalId: 'ani-008', animalName: 'Nala', ownerName: 'Linh Tran', vetId: 'vet-002', vetName: 'Dr. Raj Patel', type: 'New Patient Intake', room: 'Exam 1', scheduledAt: '2026-08-04T11:00:00', durationMins: 30, status: 'scheduled' },
  { id: 'apt-1008', animalId: 'ani-006', animalName: 'Coco', ownerName: 'Tom Bradley', vetId: 'vet-006', vetName: 'Dr. Owen Fisher', type: 'Nail Trim', room: 'Exam 5', scheduledAt: '2026-08-04T08:00:00', durationMins: 15, status: 'completed' },
];
