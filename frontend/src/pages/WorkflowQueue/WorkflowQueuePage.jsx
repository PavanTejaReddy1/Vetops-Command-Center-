import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { SearchBar } from '../../components/ui/SearchBar';
import { FilterBar } from '../../components/ui/FilterBar';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/Table';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { appointmentsApi } from '../../lib/api/appointments';
import { veterinariansApi } from '../../lib/api/veterinarians';
import { appointments } from '../../data/appointments';
import { formatTime } from '../../lib/utils/formatters';
import { useDisclosure } from '../../hooks/useDisclosure';

const STATUS_OPTIONS = [
  { label: 'Scheduled', value: 'Scheduled' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Cancelled', value: 'Cancelled' },
];

const PRIORITY_OPTIONS = [
  { label: 'Emergency', value: 'Emergency' },
  { label: 'High', value: 'High' },
  { label: 'Medium', value: 'Medium' },
  { label: 'Low', value: 'Low' },
];

const ANIMAL_TYPES = ['Dog', 'Cat', 'Bird', 'Reptile', 'Small Mammal', 'Other'];
const VISIT_TYPES = ['Wellness Exam', 'Vaccination', 'Emergency', 'Surgery', 'Dermatology', 'Cardiology', 'Dental', 'Follow-up', 'Other'];

const columns = [
  { accessorKey: 'petName', header: 'Patient' },
  { accessorKey: 'ownerName', header: 'Owner' },
  { accessorKey: 'visitType', header: 'Visit Type' },
  {
    accessorKey: 'veterinarian',
    header: 'Assigned Vet',
    cell: (info) => info.getValue()?.fullName || 'Unassigned',
  },
  { accessorKey: 'room', header: 'Room' },
  {
    accessorKey: 'appointmentTime',
    header: 'Time',
    cell: (info) => formatTime(info.getValue()),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (info) => <StatusBadge status={info.getValue().toLowerCase().replace(' ', '-')} />,
  },
];

function AppointmentFormModal({ isOpen, onClose, appointment, veterinarians, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    appointmentId: '',
    petName: '',
    animalType: 'Dog',
    breed: '',
    ownerName: '',
    ownerPhone: '',
    veterinarian: '',
    appointmentDate: '',
    appointmentTime: '',
    visitType: 'Wellness Exam',
    symptoms: '',
    notes: '',
    priority: 'Medium',
    status: 'Scheduled',
    room: '',
    durationMins: 30,
  });

  useEffect(() => {
    if (appointment) {
      setFormData({
        appointmentId: appointment.appointmentId,
        petName: appointment.petName,
        animalType: appointment.animalType,
        breed: appointment.breed || '',
        ownerName: appointment.ownerName,
        ownerPhone: appointment.ownerPhone || '',
        veterinarian: appointment.veterinarian?._id || '',
        appointmentDate: appointment.appointmentDate ? appointment.appointmentDate.split('T')[0] : '',
        appointmentTime: appointment.appointmentTime,
        visitType: appointment.visitType,
        symptoms: appointment.symptoms || '',
        notes: appointment.notes || '',
        priority: appointment.priority,
        status: appointment.status,
        room: appointment.room || '',
        durationMins: appointment.durationMins || 30,
      });
    } else {
      setFormData({
        appointmentId: '',
        petName: '',
        animalType: 'Dog',
        breed: '',
        ownerName: '',
        ownerPhone: '',
        veterinarian: '',
        appointmentDate: '',
        appointmentTime: '',
        visitType: 'Wellness Exam',
        symptoms: '',
        notes: '',
        priority: 'Medium',
        status: 'Scheduled',
        room: '',
        durationMins: 30,
      });
    }
  }, [appointment, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={appointment ? 'Edit Appointment' : 'New Appointment'}
      size="xl"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isLoading={isSubmitting}>
            {appointment ? 'Update' : 'Create'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Appointment ID *</label>
            <Input
              value={formData.appointmentId}
              onChange={(e) => setFormData({ ...formData, appointmentId: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Pet Name *</label>
            <Input
              value={formData.petName}
              onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Animal Type *</label>
            <select
              value={formData.animalType}
              onChange={(e) => setFormData({ ...formData, animalType: e.target.value })}
              className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            >
              {ANIMAL_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Breed</label>
            <Input
              value={formData.breed}
              onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Owner Name *</label>
            <Input
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Owner Phone</label>
            <Input
              value={formData.ownerPhone}
              onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Veterinarian *</label>
            <select
              value={formData.veterinarian}
              onChange={(e) => setFormData({ ...formData, veterinarian: e.target.value })}
              className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            >
              <option value="">Select Veterinarian</option>
              {veterinarians.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.fullName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Visit Type *</label>
            <select
              value={formData.visitType}
              onChange={(e) => setFormData({ ...formData, visitType: e.target.value })}
              className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            >
              {VISIT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Date *</label>
            <Input
              type="date"
              value={formData.appointmentDate}
              onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Time *</label>
            <Input
              type="time"
              value={formData.appointmentTime}
              onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Duration (mins)</label>
            <Input
              type="number"
              min="5"
              value={formData.durationMins}
              onChange={(e) => setFormData({ ...formData, durationMins: parseInt(e.target.value) || 30 })}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Room</label>
            <Input
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Symptoms</label>
          <textarea
            value={formData.symptoms}
            onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
            className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500"
            rows="2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500"
            rows="2"
          />
        </div>
      </form>
    </Modal>
  );
}

export default function WorkflowQueuePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [page, setPage] = useState(1);
  const [appointments, setAppointments] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [veterinarians, setVeterinarians] = useState([]);
  const formModal = useDisclosure();

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = { search, page };
      if (status !== 'all') params.status = status;
      if (priority !== 'all') params.priority = priority;
      const result = await appointmentsApi.list(params);
      setAppointments(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err.message || 'Failed to fetch appointments');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVeterinarians = async () => {
    try {
      const result = await veterinariansApi.list({ limit: 100 });
      setVeterinarians(result.data);
    } catch (err) {
      console.error('Failed to fetch veterinarians:', err);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchVeterinarians();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, status, priority]);

  useEffect(() => {
    fetchAppointments();
  }, [search, status, priority, page]);

  const handleAdd = () => {
    setSelectedAppointment(null);
    formModal.open();
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    formModal.open();
  };

  const handleDelete = (appointment) => {
    setSelectedAppointment(appointment);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setIsSubmitting(true);
      await appointmentsApi.remove(selectedAppointment._id);
      setDeleteConfirmOpen(false);
      setSelectedAppointment(null);
      fetchAppointments();
    } catch (err) {
      setError(err.message || 'Failed to delete appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      if (selectedAppointment) {
        await appointmentsApi.update(selectedAppointment._id, formData);
      } else {
        await appointmentsApi.create(formData);
      }
      formModal.close();
      setSelectedAppointment(null);
      fetchAppointments();
    } catch (err) {
      setError(err.message || 'Failed to save appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Workflow Queue"
        description="Real-time visit pipeline across every room and department."
        actions={
          <Button icon={Plus} onClick={handleAdd}>
            New Appointment
          </Button>
        }
      />

      <Card padded={false}>
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchBar value={search} onChange={setSearch} placeholder="Search patient, owner, or appointment ID…" className="sm:max-w-xs" />
          <FilterBar
            filters={[
              { id: 'status', label: 'Status', value: status, options: STATUS_OPTIONS, onChange: setStatus },
              { id: 'priority', label: 'Priority', value: priority, options: PRIORITY_OPTIONS, onChange: setPriority },
            ]}
            onClearAll={() => {
              setStatus('all');
              setPriority('all');
            }}
          />
        </div>

        <div className="p-4">
          <DataTable
            columns={[
              ...columns,
              {
                id: 'actions',
                header: '',
                cell: (info) => (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(info.row.original)}
                      className="rounded-md p-1.5 text-ink-muted hover:bg-canvas hover:text-ink"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(info.row.original)}
                      className="rounded-md p-1.5 text-signal-rose hover:bg-signal-rose-soft"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ),
              },
            ]}
            data={appointments}
            isLoading={isLoading}
            error={error}
            emptyTitle="No matching visits"
            emptyDescription="Try a different search term or clear the filters."
          />
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <p className="text-sm text-ink-muted">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      <AppointmentFormModal
        isOpen={formModal.isOpen}
        onClose={formModal.close}
        appointment={selectedAppointment}
        veterinarians={veterinarians}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Delete Appointment"
        description="Are you sure you want to delete this appointment? This action cannot be undone."
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete} isLoading={isSubmitting}>
              Delete
            </Button>
          </>
        }
      />
    </div>
  );
}
