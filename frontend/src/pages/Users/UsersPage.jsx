import { useEffect, useMemo, useState } from 'react';
import { UserPlus, MoreVertical, Trash2, Edit } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { SearchBar } from '../../components/ui/SearchBar';
import { DataTable } from '../../components/ui/Table';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { veterinariansApi } from '../../lib/api/veterinarians';
import { initials } from '../../lib/utils/formatters';
import { useDisclosure } from '../../hooks/useDisclosure';

const SPECIALIZATIONS = [
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
];

const DEPARTMENTS = ['Emergency', 'Surgery', 'Internal Medicine', 'Outpatient', 'Diagnostic', 'Other'];

const STATUSES = ['Active', 'On Leave', 'Inactive'];

const AVAILABILITIES = ['Available', 'Busy', 'Off Duty'];

const columns = [
  {
    accessorKey: 'fullName',
    header: 'Name',
    cell: (info) => (
      <div className="flex items-center gap-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-500 text-[11px] font-semibold text-white">
          {initials(info.getValue())}
        </span>
        <span className="font-medium text-ink">{info.getValue()}</span>
      </div>
    ),
  },
  {
    accessorKey: 'specialization',
    header: 'Specialty',
    cell: (info) => <Badge variant="neutral">{info.getValue()}</Badge>,
  },
  { accessorKey: 'department', header: 'Department' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (info) => <StatusBadge status={info.getValue().toLowerCase()} />,
  },
  {
    accessorKey: 'availability',
    header: 'Availability',
    cell: (info) => <Badge variant={info.getValue() === 'Available' ? 'success' : 'neutral'}>{info.getValue()}</Badge>,
  },
];

function VeterinarianFormModal({ isOpen, onClose, veterinarian, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    fullName: '',
    employeeId: '',
    email: '',
    phone: '',
    specialization: 'General Practice',
    qualification: '',
    yearsOfExperience: 0,
    department: 'Emergency',
    status: 'Active',
    availability: 'Available',
    profileImage: '',
  });

  useEffect(() => {
    if (veterinarian) {
      setFormData(veterinarian);
    } else {
      setFormData({
        fullName: '',
        employeeId: '',
        email: '',
        phone: '',
        specialization: 'General Practice',
        qualification: '',
        yearsOfExperience: 0,
        department: 'Emergency',
        status: 'Active',
        availability: 'Available',
        profileImage: '',
      });
    }
  }, [veterinarian, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={veterinarian ? 'Edit Veterinarian' : 'Add Veterinarian'}
      size="xl"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isLoading={isSubmitting}>
            {veterinarian ? 'Update' : 'Create'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Full Name *</label>
            <Input
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Employee ID *</label>
            <Input
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Email *</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Phone</label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Specialization *</label>
            <select
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            >
              {SPECIALIZATIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Qualification *</label>
            <Input
              value={formData.qualification}
              onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Years of Experience *</label>
            <Input
              type="number"
              min="0"
              value={formData.yearsOfExperience}
              onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) || 0 })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Department *</label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Availability</label>
            <select
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {AVAILABILITIES.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default function UsersPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [veterinarians, setVeterinarians] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedVeterinarian, setSelectedVeterinarian] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const formModal = useDisclosure();

  const fetchVeterinarians = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = { search, page };
      if (specializationFilter) params.specialization = specializationFilter;
      if (departmentFilter) params.department = departmentFilter;
      if (statusFilter) params.status = statusFilter;
      const result = await veterinariansApi.list(params);
      setVeterinarians(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err.message || 'Failed to fetch veterinarians');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [search, specializationFilter, departmentFilter, statusFilter]);

  useEffect(() => {
    fetchVeterinarians();
  }, [search, specializationFilter, departmentFilter, statusFilter, page]);

  const handleAdd = () => {
    setSelectedVeterinarian(null);
    formModal.open();
  };

  const handleEdit = (veterinarian) => {
    setSelectedVeterinarian(veterinarian);
    formModal.open();
  };

  const handleDelete = (veterinarian) => {
    setSelectedVeterinarian(veterinarian);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setIsSubmitting(true);
      await veterinariansApi.remove(selectedVeterinarian._id);
      setDeleteConfirmOpen(false);
      setSelectedVeterinarian(null);
      fetchVeterinarians();
    } catch (err) {
      setError(err.message || 'Failed to delete veterinarian');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      if (selectedVeterinarian) {
        await veterinariansApi.update(selectedVeterinarian._id, formData);
      } else {
        await veterinariansApi.create(formData);
      }
      formModal.close();
      setSelectedVeterinarian(null);
      fetchVeterinarians();
    } catch (err) {
      setError(err.message || 'Failed to save veterinarian');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Users"
        description="Staff accounts, roles, and shift status."
        actions={
          <Button icon={UserPlus} onClick={handleAdd}>
            Add Veterinarian
          </Button>
        }
      />

      <Card padded={false}>
        <div className="border-b border-border p-4 space-y-3">
          <div className="flex flex-wrap gap-3">
            <SearchBar value={search} onChange={setSearch} placeholder="Search staff by name, email, or employee ID…" className="sm:max-w-xs" />
            <select
              value={specializationFilter}
              onChange={(e) => setSpecializationFilter(e.target.value)}
              className="rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">All Specializations</option>
              {SPECIALIZATIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">All Statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
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
            data={veterinarians}
            isLoading={isLoading}
            error={error}
            emptyTitle="No staff found"
            emptyDescription="Try a different search term, or add a new veterinarian."
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

      <VeterinarianFormModal
        isOpen={formModal.isOpen}
        onClose={formModal.close}
        veterinarian={selectedVeterinarian}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Delete Veterinarian"
        description="Are you sure you want to delete this veterinarian? This action cannot be undone."
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
