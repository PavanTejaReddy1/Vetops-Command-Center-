import { useEffect, useState } from 'react';
import { Plus, UserCog, Edit, Trash2, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { SearchBar } from '../../components/ui/SearchBar';
import { FilterBar } from '../../components/ui/FilterBar';
import { Badge } from '../../components/ui/Badge';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useDisclosure } from '../../hooks/useDisclosure';
import { tasksApi } from '../../lib/api/tasks';
import { veterinariansApi } from '../../lib/api/veterinarians';
import { formatTime } from '../../lib/utils/formatters';

const PRIORITY_VARIANT = { Critical: 'rose', High: 'amber', Medium: 'blue', Low: 'neutral' };

const PRIORITY_OPTIONS = [
  { label: 'Critical', value: 'Critical' },
  { label: 'High', value: 'High' },
  { label: 'Medium', value: 'Medium' },
  { label: 'Low', value: 'Low' },
];

const STATUS_OPTIONS = [
  { label: 'Pending', value: 'Pending' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Cancelled', value: 'Cancelled' },
];

const CATEGORY_OPTIONS = [
  { label: 'Administrative', value: 'Administrative' },
  { label: 'Clinical', value: 'Clinical' },
  { label: 'Maintenance', value: 'Maintenance' },
  { label: 'Communication', value: 'Communication' },
  { label: 'Other', value: 'Other' },
];

function TaskFormModal({ isOpen, onClose, task, veterinarians, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    taskId: '',
    title: '',
    description: '',
    assignedTo: '',
    priority: 'Medium',
    category: 'Other',
    dueDate: '',
    status: 'Pending',
    notes: '',
  });

  useEffect(() => {
    if (task) {
      setFormData({
        taskId: task.taskId,
        title: task.title,
        description: task.description || '',
        assignedTo: task.assignedTo?._id || '',
        priority: task.priority,
        category: task.category,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        status: task.status,
        notes: task.notes || '',
      });
    } else {
      setFormData({
        taskId: '',
        title: '',
        description: '',
        assignedTo: '',
        priority: 'Medium',
        category: 'Other',
        dueDate: '',
        status: 'Pending',
        notes: '',
      });
    }
  }, [task, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task' : 'New Task'}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isLoading={isSubmitting}>
            {task ? 'Update' : 'Create'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Task ID *</label>
          <Input
            value={formData.taskId}
            onChange={(e) => setFormData({ ...formData, taskId: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Title *</label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500"
            rows="2"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Assignee *</label>
            <select
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            >
              <option value="">Select Assignee</option>
              {veterinarians.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.fullName}
                </option>
              ))}
            </select>
          </div>
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
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Due Date</label>
            <Input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>
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

export default function TaskAssignmentPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState('all');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [veterinarians, setVeterinarians] = useState([]);
  const formModal = useDisclosure();

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = { search, page };
      if (priority !== 'all') params.priority = priority;
      if (status !== 'all') params.status = status;
      const result = await tasksApi.list(params);
      setTasks(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks');
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
    fetchTasks();
    fetchVeterinarians();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, priority, status]);

  useEffect(() => {
    fetchTasks();
  }, [search, priority, status, page]);

  const handleAdd = () => {
    setSelectedTask(null);
    formModal.open();
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    formModal.open();
  };

  const handleDelete = (task) => {
    setSelectedTask(task);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setIsSubmitting(true);
      await tasksApi.remove(selectedTask._id);
      setDeleteConfirmOpen(false);
      setSelectedTask(null);
      fetchTasks();
    } catch (err) {
      setError(err.message || 'Failed to delete task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      if (selectedTask) {
        await tasksApi.update(selectedTask._id, formData);
      } else {
        await tasksApi.create(formData);
      }
      formModal.close();
      setSelectedTask(null);
      fetchTasks();
    } catch (err) {
      setError(err.message || 'Failed to save task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (task, newStatus) => {
    try {
      await tasksApi.updateStatus(task._id, newStatus);
      fetchTasks();
    } catch (err) {
      setError(err.message || 'Failed to update task status');
    }
  };

  return (
    <div>
      <PageHeader
        title="Task Assignment"
        description="Balance workload across front desk, technicians, and veterinarians."
        actions={
          <Button icon={Plus} onClick={handleAdd}>
            New Task
          </Button>
        }
      />

      <Card padded={false}>
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchBar value={search} onChange={setSearch} placeholder="Search task or assignee…" className="sm:max-w-xs" />
          <FilterBar
            filters={[
              { id: 'priority', label: 'Priority', value: priority, options: PRIORITY_OPTIONS, onChange: setPriority },
              { id: 'status', label: 'Status', value: status, options: STATUS_OPTIONS, onChange: setStatus },
            ]}
            onClearAll={() => {
              setPriority('all');
              setStatus('all');
            }}
          />
        </div>

        <div className="p-4">
          {isLoading ? (
            <LoadingSkeleton variant="list" rows={5} />
          ) : tasks.length === 0 ? (
            <EmptyState
              icon={UserCog}
              title="No tasks match your filters"
              description="Clear the filters or try a different search term."
            />
          ) : (
            <>
              <ul className="flex flex-col gap-2">
                {tasks.map((task) => (
                  <li
                    key={task._id}
                    className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant={PRIORITY_VARIANT[task.priority]}>{task.priority}</Badge>
                      <div>
                        <p className="text-sm font-medium text-ink">{task.title}</p>
                        <p className="text-xs text-ink-faint">
                          {task.assignedTo?.fullName || 'Unassigned'} · {task.category} · Due {task.dueDate ? formatTime(task.dueDate) : 'No due date'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={task.status.toLowerCase().replace(' ', '-')} />
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEdit(task)}
                          className="rounded-md p-1.5 text-ink-muted hover:bg-canvas hover:text-ink"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {task.status !== 'Completed' && (
                          <button
                            onClick={() => handleStatusUpdate(task, 'Completed')}
                            className="rounded-md p-1.5 text-brand-600 hover:bg-brand-soft"
                            title="Mark Complete"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(task)}
                          className="rounded-md p-1.5 text-signal-rose hover:bg-signal-rose-soft"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
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
            </>
          )}
        </div>
      </Card>

      <TaskFormModal
        isOpen={formModal.isOpen}
        onClose={formModal.close}
        task={selectedTask}
        veterinarians={veterinarians}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
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
