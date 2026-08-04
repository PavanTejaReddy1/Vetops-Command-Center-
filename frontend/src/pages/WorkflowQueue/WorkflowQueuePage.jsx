import { useEffect, useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { SearchBar } from '../../components/ui/SearchBar';
import { FilterBar } from '../../components/ui/FilterBar';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/Table';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { appointments } from '../../data/appointments';
import { formatTime } from '../../lib/utils/formatters';

const STATUS_OPTIONS = [
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'Waiting', value: 'waiting' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Delayed', value: 'delayed' },
  { label: 'Critical', value: 'critical' },
  { label: 'Completed', value: 'completed' },
];

const columns = [
  { accessorKey: 'animalName', header: 'Patient' },
  { accessorKey: 'ownerName', header: 'Owner' },
  { accessorKey: 'type', header: 'Visit Type' },
  { accessorKey: 'vetName', header: 'Assigned Vet' },
  { accessorKey: 'room', header: 'Room' },
  {
    accessorKey: 'scheduledAt',
    header: 'Time',
    cell: (info) => formatTime(info.getValue()),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (info) => <StatusBadge status={info.getValue()} />,
  },
];

export default function WorkflowQueuePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  const filtered = useMemo(() => {
    return appointments.filter((apt) => {
      const matchesSearch =
        !search ||
        apt.animalName.toLowerCase().includes(search.toLowerCase()) ||
        apt.ownerName.toLowerCase().includes(search.toLowerCase()) ||
        apt.vetName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === 'all' || apt.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  return (
    <div>
      <PageHeader
        title="Workflow Queue"
        description="Real-time visit pipeline across every room and department."
        actions={
          <Button variant="secondary" icon={RefreshCw} onClick={handleRefresh}>
            Refresh
          </Button>
        }
      />

      <Card padded={false}>
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchBar value={search} onChange={setSearch} placeholder="Search patient, owner, or vet…" className="sm:max-w-xs" />
          <FilterBar
            filters={[{ id: 'status', label: 'Status', value: status, options: STATUS_OPTIONS, onChange: setStatus }]}
            onClearAll={() => setStatus('all')}
          />
        </div>

        <div className="p-4">
          <DataTable
            columns={columns}
            data={filtered}
            isLoading={isLoading}
            emptyTitle="No matching visits"
            emptyDescription="Try a different search term or clear the status filter."
          />
        </div>
      </Card>
    </div>
  );
}
