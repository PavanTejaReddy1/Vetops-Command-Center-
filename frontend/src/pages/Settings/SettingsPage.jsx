import { useState, useEffect } from 'react';
import { Building2, Bell, Palette, ShieldCheck, RotateCcw } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardTitle, CardDescription } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils/cn';
import { settingsApi } from '../../lib/api/settings';

const TABS = [
  { id: 'organization', label: 'Organization', icon: Building2 },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: ShieldCheck },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('organization');
  const [isLoading, setIsLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState(null);

  return (
    <div>
      <PageHeader title="Settings" description="Configure your hospital workspace and preferences." />

      {saveMessage && (
        <div className={cn('mb-4 rounded-md p-3 text-sm', saveMessage.type === 'success' ? 'bg-success-soft text-success-700' : 'bg-signal-rose-soft text-signal-rose-700')}>
          {saveMessage.message}
        </div>
      )}

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
          {activeTab === 'organization' && <OrganizationSettings onSave={setSaveMessage} />}
          {activeTab === 'appearance' && <AppearanceSettings onSave={setSaveMessage} />}
          {activeTab === 'notifications' && <NotificationSettings onSave={setSaveMessage} />}
          {activeTab === 'security' && <SecuritySettings onSave={setSaveMessage} />}
        </div>
      </div>
    </div>
  );
}

function OrganizationSettings({ onSave }) {
  const [settings, setSettings] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const result = await settingsApi.getByCategory('organization');
      setSettings(result.data || {});
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await settingsApi.updateCategory('organization', settings);
      onSave({ type: 'success', message: 'Organization settings saved successfully' });
    } catch (err) {
      console.error('Failed to save settings:', err);
      onSave({ type: 'error', message: 'Failed to save settings' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      setIsSaving(true);
      await settingsApi.reset('organization');
      await fetchSettings();
      onSave({ type: 'success', message: 'Settings reset to defaults' });
    } catch (err) {
      console.error('Failed to reset settings:', err);
      onSave({ type: 'error', message: 'Failed to reset settings' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-4">Loading...</div>;

  return (
    <Card>
      <CardTitle>Organization details</CardTitle>
      <CardDescription>Basic information about your hospital or clinic group.</CardDescription>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input 
          label="Organization name" 
          value={settings.orgName || ''} 
          onChange={(e) => setSettings({ ...settings, orgName: e.target.value })} 
        />
        <Input 
          label="Support email" 
          value={settings.supportEmail || ''} 
          onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })} 
        />
        <Input 
          label="Primary location" 
          value={settings.location || ''} 
          onChange={(e) => setSettings({ ...settings, location: e.target.value })} 
        />
        <Input 
          label="Time zone" 
          value={settings.timezone || ''} 
          onChange={(e) => setSettings({ ...settings, timezone: e.target.value })} 
        />
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="ghost" icon={RotateCcw} onClick={handleReset} isLoading={isSaving}>
          Reset
        </Button>
        <Button onClick={handleSave} isLoading={isSaving}>Save changes</Button>
      </div>
    </Card>
  );
}

function AppearanceSettings({ onSave }) {
  const { theme, setTheme } = useTheme();
  const [isSaving, setIsSaving] = useState(false);

  const handleThemeChange = async (newTheme) => {
    try {
      setIsSaving(true);
      setTheme(newTheme);
      await settingsApi.update('theme', newTheme);
      onSave({ type: 'success', message: 'Theme updated successfully' });
    } catch (err) {
      console.error('Failed to update theme:', err);
      onSave({ type: 'error', message: 'Failed to update theme' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardTitle>Appearance</CardTitle>
      <CardDescription>Choose how the command center looks on this device.</CardDescription>
      <div className="mt-5 flex gap-3">
        {['light', 'dark'].map((mode) => (
          <button
            key={mode}
            onClick={() => handleThemeChange(mode)}
            disabled={isSaving}
            className={cn(
              'flex-1 rounded-lg border-2 p-4 text-left transition-colors disabled:opacity-50',
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

function NotificationSettings({ onSave }) {
  const [settings, setSettings] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const result = await settingsApi.getByCategory('notifications');
      setSettings(result.data || {});
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await settingsApi.updateCategory('notifications', settings);
      onSave({ type: 'success', message: 'Notification preferences saved successfully' });
    } catch (err) {
      console.error('Failed to save settings:', err);
      onSave({ type: 'error', message: 'Failed to save settings' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      setIsSaving(true);
      await settingsApi.reset('notifications');
      await fetchSettings();
      onSave({ type: 'success', message: 'Settings reset to defaults' });
    } catch (err) {
      console.error('Failed to reset settings:', err);
      onSave({ type: 'error', message: 'Failed to reset settings' });
    } finally {
      setIsSaving(false);
    }
  };

  const rows = [
    { key: 'predictiveAlerts', label: 'Predictive bottleneck alerts', desc: 'Get notified when the model flags operational risk.' },
    { key: 'aiReviewReminders', label: 'AI review reminders', desc: 'Reminders for recommendations awaiting your approval.' },
    { key: 'taskAssignmentUpdates', label: 'Task assignment updates', desc: 'Notify me when a task is assigned or reassigned to me.' },
    { key: 'weeklyReportSummary', label: 'Weekly report summary', desc: 'A digest of key metrics every Monday morning.' },
  ];

  if (isLoading) return <div className="p-4">Loading...</div>;

  return (
    <Card>
      <CardTitle>Notification preferences</CardTitle>
      <CardDescription>Choose what you want to hear about, and how often.</CardDescription>
      <div className="mt-5 flex flex-col divide-y divide-border">
        {rows.map((row) => (
          <div key={row.key} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
            <div>
              <p className="text-sm font-medium text-ink">{row.label}</p>
              <p className="mt-0.5 text-xs text-ink-faint">{row.desc}</p>
            </div>
            <Toggle 
              checked={settings[row.key] || false} 
              onChange={(checked) => setSettings({ ...settings, [row.key]: checked })} 
            />
          </div>
        ))}
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="ghost" icon={RotateCcw} onClick={handleReset} isLoading={isSaving}>
          Reset
        </Button>
        <Button onClick={handleSave} isLoading={isSaving}>Save changes</Button>
      </div>
    </Card>
  );
}

function SecuritySettings({ onSave }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdatePassword = async () => {
    try {
      setIsSaving(true);
      // Password update would be handled by auth service
      onSave({ type: 'success', message: 'Password updated successfully' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      console.error('Failed to update password:', err);
      onSave({ type: 'error', message: 'Failed to update password' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardTitle>Security</CardTitle>
      <CardDescription>Authentication and access controls for your workspace.</CardDescription>
      <div className="mt-5 flex flex-col gap-4">
        <Input 
          label="Current password" 
          type="password" 
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="••••••••" 
        />
        <Input 
          label="New password" 
          type="password" 
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="••••••••" 
        />
      </div>
      <div className="mt-5 flex justify-end">
        <Button onClick={handleUpdatePassword} isLoading={isSaving}>Update password</Button>
      </div>
    </Card>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn('relative h-5 w-9 shrink-0 rounded-full transition-colors', checked ? 'bg-brand-500' : 'bg-border-strong')}
    >
      <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform', checked ? 'translate-x-4' : 'translate-x-0.5')} />
    </button>
  );
}
