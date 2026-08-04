import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  ChevronDown,
  Menu,
  Moon,
  Plus,
  Sun,
  UserPlus,
  CalendarPlus,
  ClipboardPlus,
} from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';
import { SearchBar } from '../components/ui/SearchBar';
import { Button } from '../components/ui/Button';
import { useTheme } from '../hooks/useTheme';
import { useDisclosure } from '../hooks/useDisclosure';
import { useAuth } from '../app/providers/AuthProvider';
import { notificationsApi } from '../lib/api/notifications';
import { formatRelativeTime, initials } from '../lib/utils/formatters';
import { cn } from '../lib/utils/cn';

const QUICK_ACTIONS = [
  { label: 'New Appointment', icon: CalendarPlus },
  { label: 'New Task', icon: ClipboardPlus },
  { label: 'Invite User', icon: UserPlus },
];

export function Topbar({ onOpenMobileSidebar }) {
  const [search, setSearch] = useState('');
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const notifPanel = useDisclosure();
  const profilePanel = useDisclosure();
  const quickActions = useDisclosure();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const result = await notificationsApi.list({ limit: 5 });
      setNotifications(result.data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const result = await notificationsApi.getUnreadCount();
      setUnreadCount(result.data.count);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
      fetchUnreadCount();
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const currentUser = useMemo(
    () => ({
      name: user ? `${user.firstName} ${user.lastName}` : 'Guest',
      role: user ? user.role : 'Guest',
    }),
    [user]
  );

  const today = useMemo(
    () => new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date()),
    []
  );

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-surface/90 px-4 backdrop-blur sm:px-6">
      <button
        onClick={onOpenMobileSidebar}
        className="rounded-md p-1.5 text-ink-muted hover:bg-canvas lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden shrink-0 md:block">
        <Breadcrumbs />
      </div>

      <div className="ml-auto flex flex-1 items-center justify-end gap-2 sm:gap-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search patients, owners, tasks…"
          className="hidden w-full max-w-xs sm:block"
        />

        <span className="hidden whitespace-nowrap font-mono text-xs text-ink-faint lg:inline">{today}</span>

        {/* Quick actions */}
        <div className="relative">
          <Button size="sm" icon={Plus} onClick={quickActions.toggle}>
            <span className="hidden sm:inline">Quick Action</span>
          </Button>
          {quickActions.isOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={quickActions.close} />
              <div className="absolute right-0 z-20 mt-2 w-56 animate-fade-up rounded-lg border border-border bg-surface-raised p-1.5 shadow-popover">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    onClick={quickActions.close}
                    className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm text-ink hover:bg-canvas"
                  >
                    <action.icon className="h-4 w-4 text-ink-faint" />
                    {action.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={notifPanel.toggle}
            className="relative rounded-md p-2 text-ink-muted hover:bg-canvas hover:text-ink"
            aria-label="Notifications"
          >
            <Bell className="h-[18px] w-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-signal-rose ring-2 ring-surface" />
            )}
          </button>
          {notifPanel.isOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={notifPanel.close} />
              <div className="absolute right-0 z-20 mt-2 w-80 animate-fade-up rounded-lg border border-border bg-surface-raised shadow-popover">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <p className="font-display text-sm font-semibold text-ink">Notifications</p>
                  <Link to="/notifications" onClick={notifPanel.close} className="text-xs font-medium text-brand-600 hover:text-brand-700">
                    View all
                  </Link>
                </div>
                <ul className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <li className="px-4 py-3 text-sm text-ink-muted">No notifications</li>
                  ) : (
                    notifications.map((n) => (
                      <li 
                        key={n._id} 
                        className="flex gap-2.5 border-b border-border px-4 py-3 last:border-0 hover:bg-canvas/60"
                        onClick={() => !n.read && handleMarkAsRead(n._id)}
                      >
                        <span className={cn('mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full', n.read ? 'bg-transparent' : 'bg-brand-500')} />
                        <div>
                          <p className="text-sm text-ink">{n.title}</p>
                          <p className="mt-0.5 text-xs text-ink-faint">{formatRelativeTime(n.createdAt)}</p>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-md p-2 text-ink-muted hover:bg-canvas hover:text-ink"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
        </button>

        {/* Profile */}
        <div className="relative">
          <button onClick={profilePanel.toggle} className="flex items-center gap-2 rounded-md py-1 pl-1 pr-2 hover:bg-canvas">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-xs font-semibold text-white">
              {initials(currentUser.name)}
            </span>
            <ChevronDown className="hidden h-3.5 w-3.5 text-ink-faint sm:block" />
          </button>
          {profilePanel.isOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={profilePanel.close} />
              <div className="absolute right-0 z-20 mt-2 w-52 animate-fade-up rounded-lg border border-border bg-surface-raised p-1.5 shadow-popover">
                <div className="px-2.5 py-2">
                  <p className="text-sm font-medium text-ink">{currentUser.name}</p>
                  <p className="text-xs text-ink-faint">{currentUser.role}</p>
                </div>
                <div className="my-1 h-px bg-border" />
                <Link to="/settings" onClick={profilePanel.close} className="block rounded-md px-2.5 py-2 text-sm text-ink hover:bg-canvas">
                  Account settings
                </Link>
                <button
                  onClick={() => {
                    logout();
                    profilePanel.close();
                  }}
                  className="w-full rounded-md px-2.5 py-2 text-left text-sm text-signal-rose hover:bg-signal-rose-soft"
                >
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
