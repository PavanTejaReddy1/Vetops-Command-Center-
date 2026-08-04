import { useEffect, useMemo, useState } from 'react';
import { Plus, UserCog } from 'lucide-react';
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
import { tasks } from '../../data/tasks';
import { formatTime } from '../../lib/utils/formatters';

const PRIORITY_VARIANT = { urgent: 'rose', high: 'amber', medium: 'blue', low: 'neutral' };

const PRIORITY_OPTIONS = [
  { label: 'Urgent', value: 'urgent' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
];

export default function TaskAssignmentPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState('all');
  const newTaskModal = useDisclosure();

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        !search ||
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.assignee.toLowerCase().includes(search.toLowerCase());
      const matchesPriority = priority === 'all' || task.priority === priority;
      return matchesSearch && matchesPriority;
    });
  }, [search, priority]);

  return (
    <div>
      <PageHeader
        title="Task Assignment"
        description="Balance workload across front desk, technicians, and veterinarians."
        actions={
          <Button icon={Plus} onClick={newTaskModal.open}>
            New Task
          </Button>
        }
      />

      <Card padded={false}>
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchBar value={search} onChange={setSearch} placeholder="Search task or assignee…" className="sm:max-w-xs" />
          <FilterBar
            filters={[{ id: 'priority', label: 'Priority', value: priority, options: PRIORITY_OPTIONS, onChange: setPriority }]}
            onClearAll={() => setPriority('all')}
          />
        </div>

        <div className="p-4">
          {isLoading ? (
            <LoadingSkeleton variant="list" rows={5} />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={UserCog}
              title="No tasks match your filters"
              description="Clear the priority filter or try a different search term."
            />
          ) : (
            <ul className="flex flex-col gap-2">
              {filtered.map((task) => (
                <li
                  key={task.id}
                  className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant={PRIORITY_VARIANT[task.priority]}>{task.priority}</Badge>
                    <div>
                      <p className="text-sm font-medium text-ink">{task.title}</p>
                      <p className="text-xs text-ink-faint">
                        {task.assignee} · {task.role} · Due {formatTime(task.dueAt)}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={task.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>

      <Modal
        isOpen={newTaskModal.isOpen}
        onClose={newTaskModal.close}
        title="Create task"
        description="Phase 2 will wire this to the task-assignment API."
        footer={
          <>
            <Button variant="secondary" onClick={newTaskModal.close}>
              Cancel
            </Button>
            <Button onClick={newTaskModal.close}>Create task</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input label="Task title" placeholder="e.g. Restock Exam Room 3" name="title" />
          <Input label="Assignee" placeholder="Search staff…" name="assignee" />
        </div>
      </Modal>
    </div>
  );
}
