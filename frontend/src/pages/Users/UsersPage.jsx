import { useEffect, useMemo, useState } from 'react';
import { UserPlus } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { SearchBar } from '../../components/ui/SearchBar';
import { DataTable } from '../../components/ui/Table';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Badge } from '../../components/ui/Badge';
import { veterinarians } from '../../data/veterinarians';
import { initials } from '../../lib/utils/formatters';

const columns = [
  {
    accessorKey: 'name',
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
  { accessorKey: 'role', header: 'Role' },
  {
    accessorKey: 'specialty',
    header: 'Specialty',
    cell: (info) => <Badge variant="neutral">{info.getValue()}</Badge>,
  },
  { accessorKey: 'shift', header: 'Shift' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (info) => <StatusBadge status={info.getValue()} />,
  },
];

export default function UsersPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(
    () => veterinarians.filter((v) => !search || v.name.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  return (
    <div>
      <PageHeader
        title="Users"
        description="Staff accounts, roles, and shift status."
        actions={
          <Button icon={UserPlus}>Invite User</Button>
        }
      />

      <Card padded={false}>
        <div className="border-b border-border p-4">
          <SearchBar value={search} onChange={setSearch} placeholder="Search staff by name…" className="sm:max-w-xs" />
        </div>
        <div className="p-4">
          <DataTable
            columns={columns}
            data={filtered}
            isLoading={isLoading}
            emptyTitle="No staff found"
            emptyDescription="Try a different search term, or invite a new user."
          />
        </div>
      </Card>
    </div>
  );
}
