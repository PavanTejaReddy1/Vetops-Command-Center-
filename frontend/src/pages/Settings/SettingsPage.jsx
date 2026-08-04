import { useState } from 'react';
import { Building2, Bell, Palette, ShieldCheck } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardTitle, CardDescription } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils/cn';
import { SITE_CONFIG } from '../../config/site';

const TABS = [
  { id: 'organization', label: 'Organization', icon: Building2 },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: ShieldCheck },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('organization');

  return (
    <div>
      <PageHeader title="Settings" description="Configure your hospital workspace and preferences." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors',
                activeTab === tab.id ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200' : 'text-ink-muted hover:bg-canvas hover:text-ink'
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div>
          {activeTab === 'organization' && <OrganizationSettings />}
          {activeTab === 'appearance' && <AppearanceSettings />}
          {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'security' && <SecuritySettings />}
        </div>
      </div>
    </div>
  );
}

function OrganizationSettings() {
  return (
    <Card>
      <CardTitle>Organization details</CardTitle>
      <CardDescription>Basic information about your hospital or clinic group.</CardDescription>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Organization name" defaultValue={SITE_CONFIG.orgName} name="orgName" />
        <Input label="Support email" defaultValue={SITE_CONFIG.supportEmail} name="supportEmail" />
        <Input label="Primary location" placeholder="e.g. Seattle, WA" name="location" />
        <Input label="Time zone" placeholder="e.g. America/Los_Angeles" name="timezone" />
      </div>
      <div className="mt-5 flex justify-end">
        <Button>Save changes</Button>
      </div>
    </Card>
  );
}

function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <CardTitle>Appearance</CardTitle>
      <CardDescription>Choose how the command center looks on this device.</CardDescription>
      <div className="mt-5 flex gap-3">
        {['light', 'dark'].map((mode) => (
          <button
            key={mode}
            onClick={() => setTheme(mode)}
            className={cn(
              'flex-1 rounded-lg border-2 p-4 text-left transition-colors',
              theme === mode ? 'border-brand-500' : 'border-border hover:border-border-strong'
            )}
          >
            <div className={cn('mb-3 h-16 rounded-md border border-border', mode === 'dark' ? 'bg-[#0a1414]' : 'bg-[#f6f8f7]')} />
            <p className="text-sm font-medium capitalize text-ink">{mode} mode</p>
          </button>
        ))}
      </div>
    </Card>
  );
}

function NotificationSettings() {
  const rows = [
    { label: 'Predictive bottleneck alerts', desc: 'Get notified when the model flags operational risk.' },
    { label: 'AI review reminders', desc: 'Reminders for recommendations awaiting your approval.' },
    { label: 'Task assignment updates', desc: 'Notify me when a task is assigned or reassigned to me.' },
    { label: 'Weekly report summary', desc: 'A digest of key metrics every Monday morning.' },
  ];

  return (
    <Card>
      <CardTitle>Notification preferences</CardTitle>
      <CardDescription>Choose what you want to hear about, and how often.</CardDescription>
      <div className="mt-5 flex flex-col divide-y divide-border">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
            <div>
              <p className="text-sm font-medium text-ink">{row.label}</p>
              <p className="mt-0.5 text-xs text-ink-faint">{row.desc}</p>
            </div>
            <ToggleStub defaultChecked />
          </div>
        ))}
      </div>
    </Card>
  );
}

function SecuritySettings() {
  return (
    <Card>
      <CardTitle>Security</CardTitle>
      <CardDescription>Authentication and access controls for your workspace.</CardDescription>
      <div className="mt-5 flex flex-col gap-4">
        <Input label="Current password" type="password" name="currentPassword" placeholder="••••••••" />
        <Input label="New password" type="password" name="newPassword" placeholder="••••••••" />
      </div>
      <div className="mt-5 flex justify-end">
        <Button>Update password</Button>
      </div>
    </Card>
  );
}

function ToggleStub({ defaultChecked = false }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => setChecked((c) => !c)}
      className={cn('relative h-5 w-9 shrink-0 rounded-full transition-colors', checked ? 'bg-brand-500' : 'bg-border-strong')}
    >
      <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform', checked ? 'translate-x-4' : 'translate-x-0.5')} />
    </button>
  );
}
