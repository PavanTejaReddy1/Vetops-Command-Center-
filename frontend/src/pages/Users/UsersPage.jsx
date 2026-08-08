import { useEffect, useState } from 'react';
import { UserPlus, Edit, Trash2, ToggleLeft, ToggleRight, Users } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { SearchBar } from '../../components/ui/SearchBar';
import { DataTable } from '../../components/ui/Table';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';
import { veterinariansApi } from '../../lib/api/veterinarians';
import { usersApi } from '../../lib/api/users';
import { initials } from '../../lib/utils/formatters';
import { useDisclosure } from '../../hooks/useDisclosure';

const ROLES = ['admin', 'manager', 'analyst', 'field_staff', 'veterinarian', 'receptionist'];
const ROLE_LABEL = { admin: 'Admin', manager: 'Manager', analyst: 'Analyst', field_staff: 'Field Staff', veterinarian: 'Veterinarian', receptionist: 'Receptionist' };
const ROLE_VARIANT = { admin: 'rose', manager: 'amber', analyst: 'blue', field_staff: 'neutral', veterinarian: 'brand', receptionist: 'success' };

const SPECIALIZATIONS = ['General Practice','Surgery','Internal Medicine','Emergency & Critical Care','Dermatology','Cardiology','Oncology','Neurology','Radiology','Ophthalmology','Other'];
const DEPARTMENTS = ['Emergency','Surgery','Internal Medicine','Outpatient','Diagnostic','Other'];
const VET_STATUSES = ['Active','On Leave','Inactive'];
const VET_AVAILABILITIES = ['Available','Busy','Off Duty'];

// ── Invite / Create User Modal ─────────────────────────────────────────────
function InviteUserModal({ isOpen, onClose, onSubmit, isSubmitting, error }) {
  const [form, setForm] = useState({ email: '', firstName: '', lastName: '', role: 'field_staff', department: '', jobTitle: '', phone: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    if (isOpen) setForm({ email: '', firstName: '', lastName: '', role: 'field_staff', department: '', jobTitle: '', phone: '' });
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite User" size="lg"
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={() => onSubmit(form)} isLoading={isSubmitting}>Send Invite</Button></>}>
      <div className="space-y-4">
        {error && <Alert variant="error" title={error} />}
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-ink mb-1">First Name *</label><Input value={form.firstName} onChange={e => set('firstName', e.target.value)} required /></div>
          <div><label className="block text-sm font-medium text-ink mb-1">Last Name *</label><Input value={form.lastName} onChange={e => set('lastName', e.target.value)} required /></div>
        </div>
        <div><label className="block text-sm font-medium text-ink mb-1">Email *</label><Input type="email" value={form.email} onChange={e => set('email', e.target.value)} required /></div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Role</label>
            <select value={form.role} onChange={e => set('role', e.target.value)} className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500">
              {ROLES.map(r => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
            </select>
          </div>
          <div><label className="block text-sm font-medium text-ink mb-1">Job Title</label><Input value={form.jobTitle} onChange={e => set('jobTitle', e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-ink mb-1">Department</label><Input value={form.department} onChange={e => set('department', e.target.value)} /></div>
          <div><label className="block text-sm font-medium text-ink mb-1">Phone</label><Input value={form.phone} onChange={e => set('phone', e.target.value)} /></div>
        </div>
      </div>
    </Modal>
  );
}

// ── Veterinarian Form Modal ────────────────────────────────────────────────
function VeterinarianFormModal({ isOpen, onClose, veterinarian, onSubmit, isSubmitting, error }) {
  const blank = { fullName: '', employeeId: '', email: '', phone: '', specialization: 'General Practice', qualification: '', yearsOfExperience: 0, department: 'Emergency', status: 'Active', availability: 'Available' };
  const [form, setForm] = useState(blank);

  useEffect(() => {
    setForm(veterinarian ? { ...blank, ...veterinarian } : blank);
  }, [veterinarian, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={veterinarian ? 'Edit Veterinarian' : 'Add Veterinarian'} size="xl"
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={() => onSubmit(form)} isLoading={isSubmitting}>{veterinarian ? 'Update' : 'Create'}</Button></>}>
      <div className="space-y-4">
        {error && <Alert variant="error" title={error} />}
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-ink mb-1">Full Name *</label><Input value={form.fullName} onChange={e => setForm(f=>({...f, fullName: e.target.value}))} required /></div>
          <div><label className="block text-sm font-medium text-ink mb-1">Employee ID *</label><Input value={form.employeeId} onChange={e => setForm(f=>({...f, employeeId: e.target.value}))} required /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-ink mb-1">Email *</label><Input type="email" value={form.email} onChange={e => setForm(f=>({...f, email: e.target.value}))} required /></div>
          <div><label className="block text-sm font-medium text-ink mb-1">Phone</label><Input value={form.phone} onChange={e => setForm(f=>({...f, phone: e.target.value}))} /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-ink mb-1">Specialization *</label>
            <select value={form.specialization} onChange={e => setForm(f=>({...f, specialization: e.target.value}))} className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500">
              {SPECIALIZATIONS.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div><label className="block text-sm font-medium text-ink mb-1">Qualification *</label><Input value={form.qualification} onChange={e => setForm(f=>({...f, qualification: e.target.value}))} required /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-ink mb-1">Years of Experience *</label><Input type="number" min="0" value={form.yearsOfExperience} onChange={e => setForm(f=>({...f, yearsOfExperience: parseInt(e.target.value)||0}))} required /></div>
          <div><label className="block text-sm font-medium text-ink mb-1">Department *</label>
            <select value={form.department} onChange={e => setForm(f=>({...f, department: e.target.value}))} className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500">
              {DEPARTMENTS.map(d=><option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-ink mb-1">Status</label>
            <select value={form.status} onChange={e => setForm(f=>({...f, status: e.target.value}))} className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500">
              {VET_STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div><label className="block text-sm font-medium text-ink mb-1">Availability</label>
            <select value={form.availability} onChange={e => setForm(f=>({...f, availability: e.target.value}))} className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500">
              {VET_AVAILABILITIES.map(a=><option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function UsersPage() {
  const [tab, setTab] = useState('vets'); // 'vets' | 'users'
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState(1);

  // Veterinarian state
  const [vets, setVets] = useState([]);
  const [vetPagination, setVetPagination] = useState(null);
  const [selectedVet, setSelectedVet] = useState(null);
  const [deleteVetOpen, setDeleteVetOpen] = useState(false);
  const vetFormModal = useDisclosure();

  // User / invite state
  const [users, setUsers] = useState([]);
  const [userPagination, setUserPagination] = useState(null);
  const inviteModal = useDisclosure();

  const fetchVets = async () => {
    try { setIsLoading(true); const r = await veterinariansApi.list({ search, page }); setVets(r.data); setVetPagination(r.pagination); }
    catch (e) { setError(e.message); }
    finally { setIsLoading(false); }
  };

  const fetchUsers = async () => {
    try { setIsLoading(true); const r = await usersApi.list({ search, page }); setUsers(r.data); setUserPagination(r.pagination); }
    catch (e) { setError(e.message); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { setPage(1); }, [search, tab]);
  useEffect(() => { if (tab === 'vets') fetchVets(); else fetchUsers(); }, [search, page, tab]);

  const handleVetSubmit = async (form) => {
    try { setIsSubmitting(true); setFormError(null);
      if (selectedVet) await veterinariansApi.update(selectedVet._id, form);
      else await veterinariansApi.create(form);
      vetFormModal.close(); setSelectedVet(null); fetchVets();
    } catch (e) { setFormError(e.message); } finally { setIsSubmitting(false); }
  };

  const handleVetDelete = async () => {
    try { setIsSubmitting(true); await veterinariansApi.remove(selectedVet._id); setDeleteVetOpen(false); setSelectedVet(null); fetchVets(); }
    catch (e) { setError(e.message); } finally { setIsSubmitting(false); }
  };

  const handleInviteSubmit = async (form) => {
    try { setIsSubmitting(true); setFormError(null);
      await usersApi.invite(form);
      inviteModal.close(); fetchUsers();
    } catch (e) { setFormError(e.message); } finally { setIsSubmitting(false); }
  };

  const handleToggleUser = async (user) => {
    try { await usersApi.toggleActive(user._id, !user.isActive); fetchUsers(); }
    catch (e) { setError(e.message); }
  };

  const vetColumns = [
    { accessorKey: 'fullName', header: 'Name', cell: info => (
      <div className="flex items-center gap-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-500 text-[11px] font-semibold text-white">{initials(info.getValue())}</span>
        <span className="font-medium text-ink">{info.getValue()}</span>
      </div>
    )},
    { accessorKey: 'specialization', header: 'Specialty', cell: info => <Badge variant="neutral">{info.getValue()}</Badge> },
    { accessorKey: 'department', header: 'Department' },
    { accessorKey: 'status', header: 'Status', cell: info => <StatusBadge status={info.getValue().toLowerCase()} /> },
    { accessorKey: 'availability', header: 'Availability', cell: info => <Badge variant={info.getValue() === 'Available' ? 'success' : 'neutral'}>{info.getValue()}</Badge> },
    { id: 'actions', header: '', cell: info => (
      <div className="flex items-center gap-1">
        <button onClick={() => { setSelectedVet(info.row.original); vetFormModal.open(); }} className="rounded-md p-1.5 text-ink-muted hover:bg-canvas hover:text-ink"><Edit className="h-4 w-4" /></button>
        <button onClick={() => { setSelectedVet(info.row.original); setDeleteVetOpen(true); }} className="rounded-md p-1.5 text-signal-rose hover:bg-signal-rose-soft"><Trash2 className="h-4 w-4" /></button>
      </div>
    )},
  ];

  const userColumns = [
    { accessorKey: 'firstName', header: 'Name', cell: info => (
      <div className="flex items-center gap-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-500 text-[11px] font-semibold text-white">{initials(`${info.row.original.firstName} ${info.row.original.lastName}`)}</span>
        <div><p className="font-medium text-ink">{info.row.original.firstName} {info.row.original.lastName}</p><p className="text-xs text-ink-faint">{info.row.original.email}</p></div>
      </div>
    )},
    { accessorKey: 'role', header: 'Role', cell: info => <Badge variant={ROLE_VARIANT[info.getValue()] || 'neutral'}>{ROLE_LABEL[info.getValue()] || info.getValue()}</Badge> },
    { accessorKey: 'jobTitle', header: 'Job Title', cell: info => info.getValue() || '—' },
    { accessorKey: 'department', header: 'Department', cell: info => info.getValue() || '—' },
    { accessorKey: 'isActive', header: 'Status', cell: info => <StatusBadge status={info.getValue() ? 'active' : 'inactive'} /> },
    { id: 'actions', header: '', cell: info => (
      <button onClick={() => handleToggleUser(info.row.original)} className="rounded-md p-1.5 text-ink-muted hover:bg-canvas hover:text-ink" title={info.row.original.isActive ? 'Deactivate' : 'Activate'}>
        {info.row.original.isActive ? <ToggleRight className="h-4 w-4 text-brand-600" /> : <ToggleLeft className="h-4 w-4" />}
      </button>
    )},
  ];

  const pagination = tab === 'vets' ? vetPagination : userPagination;

  return (
    <div>
      <PageHeader
        title="Users & Staff"
        description="Manage veterinarians, staff accounts, roles, and access."
        actions={
          <div className="flex gap-2">
            <Button icon={UserPlus} variant="secondary" onClick={() => { inviteModal.open(); setFormError(null); }}>Invite User</Button>
            <Button icon={Users} onClick={() => { setSelectedVet(null); vetFormModal.open(); setFormError(null); }}>Add Veterinarian</Button>
          </div>
        }
      />

      {/* Tab switcher */}
      <div className="mb-4 flex gap-1 border-b border-border">
        {[['vets', 'Veterinarians'], ['users', 'System Users']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === key ? 'border-brand-500 text-brand-600' : 'border-transparent text-ink-muted hover:text-ink'}`}>
            {label}
          </button>
        ))}
      </div>

      <Card padded={false}>
        <div className="border-b border-border p-4">
          <SearchBar value={search} onChange={setSearch} placeholder={tab === 'vets' ? 'Search by name, email, or employee ID…' : 'Search by name or email…'} className="sm:max-w-xs" />
        </div>
        <div className="p-4">
          <DataTable
            columns={tab === 'vets' ? vetColumns : userColumns}
            data={tab === 'vets' ? vets : users}
            isLoading={isLoading}
            error={error}
            emptyTitle={tab === 'vets' ? 'No veterinarians found' : 'No users found'}
            emptyDescription={tab === 'vets' ? 'Add a veterinarian to get started.' : 'Invite a user to get started.'}
          />
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <p className="text-sm text-ink-muted">Showing {((pagination.page-1)*pagination.limit)+1}–{Math.min(pagination.page*pagination.limit, pagination.total)} of {pagination.total}</p>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setPage(p => Math.max(1, p-1))} disabled={pagination.page === 1}>Previous</Button>
                <Button variant="ghost" size="sm" onClick={() => setPage(p => Math.min(pagination.totalPages, p+1))} disabled={pagination.page === pagination.totalPages}>Next</Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      <VeterinarianFormModal isOpen={vetFormModal.isOpen} onClose={vetFormModal.close} veterinarian={selectedVet} onSubmit={handleVetSubmit} isSubmitting={isSubmitting} error={formError} />
      <InviteUserModal isOpen={inviteModal.isOpen} onClose={inviteModal.close} onSubmit={handleInviteSubmit} isSubmitting={isSubmitting} error={formError} />
      <Modal isOpen={deleteVetOpen} onClose={() => setDeleteVetOpen(false)} title="Delete Veterinarian" description="Are you sure? This action cannot be undone."
        footer={<><Button variant="ghost" onClick={() => setDeleteVetOpen(false)}>Cancel</Button><Button variant="danger" onClick={handleVetDelete} isLoading={isSubmitting}>Delete</Button></>} />
    </div>
  );
}
