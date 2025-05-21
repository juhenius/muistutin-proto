import React, { useState, useEffect } from 'react';

const MEMBERS_KEY = 'muistutin:familyMembers';
const REMINDERS_KEY = 'muistutin:reminders';

// Repeat rule types
const WEEKDAYS = [1, 2, 3, 4, 5];
const WEEKENDS = [0, 6];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type RepeatRule =
  | { type: 'none' }
  | { type: 'everyday' }
  | { type: 'weekdays' }
  | { type: 'weekends' }
  | { type: 'daysOfWeek'; days: number[] }
  | { type: 'custom'; interval: number; unit: 'day' | 'week' | 'month' };

type ReminderHistoryEntry = { timestamp: number; done: boolean };
type Reminder = {
  title: string;
  assignedTo: string; // member name
  done: boolean;
  repeat: RepeatRule;
  history: ReminderHistoryEntry[];
  deadline: string; // For repeating: 'HH:mm', for non-repeating: ISO date-time string
};

type ModalType = 'member' | 'reminder' | null;

function getRepeatSummary(rule: RepeatRule): string {
  switch (rule.type) {
    case 'none':
      return 'Does not repeat';
    case 'everyday':
      return 'Repeats every day';
    case 'weekdays':
      return 'Repeats on weekdays';
    case 'weekends':
      return 'Repeats on weekends';
    case 'daysOfWeek':
      return `Repeats on ${rule.days.map(d => DAY_NAMES[d]).join(', ')}`;
    case 'custom':
      return `Repeats every ${rule.interval} ${rule.unit}${rule.interval > 1 ? 's' : ''}`;
    default:
      return '';
  }
}

const defaultRepeat: RepeatRule = { type: 'none' };

const App: React.FC = () => {
  // Family members
  const [members, setMembers] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  // Reminders
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderAssignee, setReminderAssignee] = useState('');
  const [reminderError, setReminderError] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [repeat, setRepeat] = useState<RepeatRule>(defaultRepeat);
  // For custom repeat
  const [customInterval, setCustomInterval] = useState(2);
  const [customUnit, setCustomUnit] = useState<'day' | 'week' | 'month'>('day');
  const [customDays, setCustomDays] = useState<number[]>([]);

  // Modal state
  const [modal, setModal] = useState<ModalType>(null);
  const [fabMenuOpen, setFabMenuOpen] = useState(false);

  // Today/All view state
  const [view, setView] = useState<'today' | 'all'>('today');

  // Mocked date/time state
  const [mockedNow, setMockedNow] = useState<Date | null>(null);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [tempDate, setTempDate] = useState('');
  const [tempTime, setTempTime] = useState('');

  // Live clock for real time
  const [now, setNow] = useState<Date>(new Date());
  useEffect(() => {
    if (!mockedNow) {
      const interval = setInterval(() => setNow(new Date()), 1000);
      return () => clearInterval(interval);
    }
  }, [mockedNow]);

  // Helper to get current date/time (mocked or real)
  function getNow() {
    return mockedNow ? new Date(mockedNow) : new Date();
  }

  // When opening the time modal, prefill with current mocked or real time
  const openTimeModal = () => {
    const now = getNow();
    setTempDate(now.toISOString().slice(0, 10));
    setTempTime(now.toTimeString().slice(0, 5));
    setShowTimeModal(true);
    setFabMenuOpen(false);
  };

  // Set mocked time from modal
  const handleSetMockedTime = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempDate || !tempTime) return;
    setMockedNow(new Date(`${tempDate}T${tempTime}`));
    setShowTimeModal(false);
  };

  // Clear mocked time
  const handleClearMockedTime = () => {
    setMockedNow(null);
    setShowTimeModal(false);
  };

  // Load members from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(MEMBERS_KEY);
    if (stored) {
      try {
        setMembers(JSON.parse(stored));
      } catch {
        setMembers([]);
      }
    }
  }, []);

  // Save members to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
  }, [members]);

  // Load reminders from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(REMINDERS_KEY);
    if (stored) {
      try {
        setReminders(JSON.parse(stored));
      } catch {
        setReminders([]);
      }
    }
  }, []);

  // Save reminders to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
  }, [reminders]);

  // Add deadline state for reminder modal
  const [deadline, setDeadline] = useState('08:00');

  // Reset form state when closing modal
  useEffect(() => {
    if (!modal) {
      setName('');
      setError('');
      setReminderTitle('');
      setReminderAssignee('');
      setReminderError('');
      setEditIndex(null);
      setRepeat(defaultRepeat);
      setCustomInterval(2);
      setCustomUnit('day');
      setCustomDays([]);
      setDeadline('08:00');
      setTempDate('');
    }
  }, [modal]);

  // Migrate reminders to have history if missing
  useEffect(() => {
    setReminders(reminders => reminders.map(r =>
      r.history ? r : { ...r, history: [] }
    ));
    // eslint-disable-next-line
  }, []);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Name cannot be empty');
      return;
    }
    if (members.includes(trimmed)) {
      setError('Member already exists');
      return;
    }
    setMembers([...members, trimmed]);
    setName('');
    setError('');
    setModal(null);
  };

  const handleAddOrEditReminder = (e: React.FormEvent) => {
    e.preventDefault();
    const title = reminderTitle.trim();
    const assignedTo = reminderAssignee;
    if (!title) {
      setReminderError('Title cannot be empty');
      return;
    }
    if (!assignedTo) {
      setReminderError('Please assign to a member');
      return;
    }
    let finalRepeat = repeat;
    if (repeat.type === 'custom') {
      finalRepeat = { type: 'custom', interval: customInterval, unit: customUnit };
    } else if (repeat.type === 'daysOfWeek') {
      finalRepeat = { type: 'daysOfWeek', days: customDays.slice().sort() };
    }
    let finalDeadline = deadline;
    if (repeat.type === 'none') {
      // Non-repeating: combine date and time
      finalDeadline = tempDate && deadline ? `${tempDate}T${deadline}` : '';
    }
    if (editIndex !== null) {
      // Edit mode: preserve done state and history
      const updated = reminders.slice();
      updated[editIndex] = { ...updated[editIndex], title, assignedTo, repeat: finalRepeat, deadline: finalDeadline };
      setReminders(updated);
      setEditIndex(null);
    } else {
      // Add mode
      setReminders([...reminders, { title, assignedTo, done: false, repeat: finalRepeat, history: [], deadline: finalDeadline }]);
    }
    setReminderTitle('');
    setReminderAssignee('');
    setReminderError('');
    setRepeat(defaultRepeat);
    setCustomInterval(2);
    setCustomUnit('day');
    setCustomDays([]);
    setDeadline('08:00');
    setModal(null);
  };

  const handleEditReminder = (idx: number) => {
    const r = reminders[idx];
    setReminderTitle(r.title);
    setReminderAssignee(r.assignedTo);
    setEditIndex(idx);
    setRepeat(r.repeat);
    if (r.repeat.type === 'custom') {
      setCustomInterval(r.repeat.interval);
      setCustomUnit(r.repeat.unit);
    } else if (r.repeat.type === 'daysOfWeek') {
      setCustomDays(r.repeat.days);
    } else {
      setCustomInterval(2);
      setCustomUnit('day');
      setCustomDays([]);
    }
    setDeadline(r.deadline || '08:00');
    if (r.repeat.type === 'none' && r.deadline) {
      // For non-repeating, extract date part for tempDate
      const [datePart, timePart] = r.deadline.split('T');
      setTempDate(datePart || '');
      setDeadline(timePart || '08:00');
    }
    setModal('reminder');
    setReminderError('');
  };

  const handleCancelEdit = () => {
    setReminderTitle('');
    setReminderAssignee('');
    setEditIndex(null);
    setReminderError('');
    setRepeat(defaultRepeat);
    setCustomInterval(2);
    setCustomUnit('day');
    setCustomDays([]);
    setDeadline('08:00');
    setModal(null);
  };

  const handleRemoveReminder = (idx: number) => {
    setReminders(reminders.filter((_, i) => i !== idx));
    if (editIndex === idx) {
      handleCancelEdit();
    }
  };

  // Helper: is reminder done for today (for repeating reminders)
  function isDoneToday(reminder: Reminder): boolean {
    if (reminder.repeat.type === 'none') return reminder.done;
    const now = getNow();
    const todayStr = now.toISOString().slice(0, 10);
    // Find the last history entry for today
    const todayEntry = [...(reminder.history || [])]
      .reverse()
      .find(entry => new Date(entry.timestamp).toISOString().slice(0, 10) === todayStr);
    return todayEntry ? todayEntry.done : false;
  }

  // Update handleToggleDone to be per-day for repeating reminders
  const handleToggleDone = (idx: number) => {
    setReminders(reminders => {
      const updated = reminders.slice();
      const now = getNow().getTime();
      const prev = updated[idx];
      if (prev.repeat.type === 'none') {
        // Non-repeating: toggle global done
        const newDone = !prev.done;
        updated[idx] = {
          ...prev,
          done: newDone,
          history: [
            ...(prev.history || []),
            { timestamp: now, done: newDone },
          ],
        };
      } else {
        // Repeating: toggle done for today
        const todayStr = getNow().toISOString().slice(0, 10);
        const lastTodayIdx = [...(prev.history || [])].map((entry, i) => ({ entry, i })).reverse().find(({ entry }) => new Date(entry.timestamp).toISOString().slice(0, 10) === todayStr)?.i;
        const alreadyDone = isDoneToday(prev);
        let newHistory = prev.history ? [...prev.history] : [];
        // Always append a new entry for today with toggled state
        newHistory.push({ timestamp: now, done: !alreadyDone });
        updated[idx] = {
          ...prev,
          history: newHistory,
        };
      }
      return updated;
    });
  };

  // Demo data generation
  const generateDemoData = () => {
    if (!window.confirm('This will overwrite your current members and reminders with demo data. Continue?')) return;
    const demoMembers = ['Anna', 'Ben', 'Charlie'];
    const todayStr = getNow().toISOString().slice(0, 10);
    const demoReminders: Reminder[] = [
      {
        title: 'Take medicine',
        assignedTo: 'Anna',
        done: false,
        repeat: { type: 'everyday' },
        history: [],
        deadline: '07:30',
      },
      {
        title: 'Bring phone',
        assignedTo: 'Ben',
        done: false,
        repeat: { type: 'weekdays' },
        history: [],
        deadline: '08:00',
      },
      {
        title: 'Pack gym clothes',
        assignedTo: 'Charlie',
        done: false,
        repeat: { type: 'daysOfWeek', days: [1, 3] }, // Mon, Wed
        history: [],
        deadline: '07:45',
      },
      {
        title: 'Take out trash',
        assignedTo: 'Anna',
        done: false,
        repeat: { type: 'custom', interval: 2, unit: 'day' },
        history: [],
        deadline: '08:15',
      },
      {
        title: 'Feed the cat',
        assignedTo: 'Ben',
        done: false,
        repeat: { type: 'weekends' },
        history: [],
        deadline: '09:00',
      },
      {
        title: 'Sign school form',
        assignedTo: 'Anna',
        done: false,
        repeat: { type: 'none' },
        history: [],
        deadline: `${todayStr}T08:30`,
      },
    ];
    setMembers(demoMembers);
    setReminders(demoReminders);
    setFabMenuOpen(false);
  };

  // Helper: is reminder due today?
  function isReminderDueToday(reminder: Reminder): boolean {
    const today = getNow();
    const day = today.getDay(); // 0=Sun, 1=Mon, ...
    const todayStr = today.toISOString().slice(0, 10);
    if (reminder.repeat.type === 'none') {
      // Find the last completion entry
      const lastDoneEntry = [...(reminder.history || [])].reverse().find(entry => entry.done);
      if (!lastDoneEntry) {
        // Never completed: show
        return true;
      }
      // If completed today, show for the rest of the day
      const doneDateStr = new Date(lastDoneEntry.timestamp).toISOString().slice(0, 10);
      if (doneDateStr === todayStr) {
        return true;
      }
      // Completed on a previous day: hide
      return false;
    }
    switch (reminder.repeat.type) {
      case 'everyday':
        return true;
      case 'weekdays':
        return day >= 1 && day <= 5;
      case 'weekends':
        return day === 0 || day === 6;
      case 'daysOfWeek':
        return reminder.repeat.days.includes(day);
      case 'custom':
        // For demo: treat as due today if interval divides days since epoch
        const start = new Date(today.getFullYear(), 0, 1);
        const daysSince = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        return daysSince % reminder.repeat.interval === 0;
      default:
        return false;
    }
  }

  // Helper: is reminder late?
  function isReminderLate(reminder: Reminder): boolean {
    if (isDoneToday(reminder)) return false;
    const now = getNow();
    if (reminder.repeat.type === 'none') {
      // Non-repeating: deadline is ISO datetime
      if (!reminder.deadline) return false;
      const deadlineDate = new Date(reminder.deadline);
      return now > deadlineDate;
    } else {
      // Repeating: deadline is time string (HH:mm)
      if (!reminder.deadline) return false;
      const [h, m] = reminder.deadline.split(':');
      const deadlineToday = new Date(now);
      deadlineToday.setHours(Number(h), Number(m), 0, 0);
      return now > deadlineToday;
    }
  }

  // Filtered reminders for current view
  const visibleReminders = view === 'all'
    ? reminders
    : reminders.filter(isReminderDueToday);

  // Helper: format deadline and time to deadline
  function formatTimeToDeadline(reminder: Reminder): string {
    const now = getNow();
    let deadlineDate: Date | null = null;
    if (reminder.repeat.type === 'none') {
      if (!reminder.deadline) return '';
      deadlineDate = new Date(reminder.deadline);
    } else {
      if (!reminder.deadline) return '';
      const [h, m] = reminder.deadline.split(':');
      deadlineDate = new Date(now);
      deadlineDate.setHours(Number(h), Number(m), 0, 0);
    }
    const diffMs = deadlineDate.getTime() - now.getTime();
    const diffMin = Math.round(diffMs / 60000);
    if (diffMin > 0) {
      return `in ${diffMin} min`;
    } else if (diffMin === 0) {
      return 'now';
    } else {
      return `${-diffMin} min ago`;
    }
  }
  function formatDeadline(reminder: Reminder): string {
    if (!reminder.deadline) return '';
    if (reminder.repeat.type === 'none') {
      // Show date and time
      const d = new Date(reminder.deadline);
      return d.toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' });
    } else {
      // Show time only
      return reminder.deadline;
    }
  }
  function getLastCompletion(reminder: Reminder): string {
    if (!reminder.history || reminder.history.length === 0) return '';
    // Find last done entry
    const lastDone = [...reminder.history].reverse().find(e => e.done);
    if (!lastDone) return '';
    const d = new Date(lastDone.timestamp);
    const now = getNow();
    const todayStr = now.toISOString().slice(0, 10);
    const doneStr = d.toISOString().slice(0, 10);
    let dayLabel = '';
    if (doneStr === todayStr) {
      dayLabel = 'today';
    } else {
      // Check if yesterday
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      if (d.toISOString().slice(0, 10) === yesterday.toISOString().slice(0, 10)) {
        dayLabel = 'yesterday';
      } else {
        dayLabel = d.toLocaleDateString();
      }
    }
    return `Last done: ${dayLabel} at ${d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
  }

  // Modal overlays
  const renderModal = () => {
    if (showTimeModal) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm relative animate-fade-in">
            <button
              className="absolute top-2 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setShowTimeModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="text-xl font-semibold text-blue-700 mb-4 text-center">Set Date & Time</h3>
            <form onSubmit={handleSetMockedTime} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={tempDate}
                  onChange={e => setTempDate(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input
                  type="time"
                  value={tempTime}
                  onChange={e => setTempTime(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                  required
                />
              </div>
              <div className="flex gap-2 justify-end">
                {mockedNow && (
                  <button
                    type="button"
                    className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                    onClick={handleClearMockedTime}
                  >
                    Clear
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Set
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }
    if (!modal) return null;
    const editingReminder = editIndex !== null ? reminders[editIndex] : null;
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm relative animate-fade-in">
          <button
            className="absolute top-2 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
            onClick={modal === 'member' ? () => setModal(null) : handleCancelEdit}
            aria-label="Close"
          >
            ×
          </button>
          {modal === 'member' ? (
            <>
              <h3 className="text-xl font-semibold text-blue-700 mb-4 text-center">Add Family Member</h3>
              <form onSubmit={handleAddMember} className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Enter member name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  aria-label="Member name"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Add
                </button>
              </form>
              {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
            </>
          ) : (
            <>
              <h3 className="text-xl font-semibold text-blue-700 mb-4 text-center">{editIndex !== null ? 'Edit Reminder' : 'Add Reminder'}</h3>
              <form onSubmit={handleAddOrEditReminder} className="flex flex-col gap-2 mb-2">
                <input
                  type="text"
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Reminder title"
                  value={reminderTitle}
                  onChange={e => setReminderTitle(e.target.value)}
                  aria-label="Reminder title"
                  autoFocus
                />
                <select
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={reminderAssignee}
                  onChange={e => setReminderAssignee(e.target.value)}
                  aria-label="Assign to member"
                  disabled={members.length === 0}
                >
                  <option value="">Assign to member...</option>
                  {members.map((member, idx) => (
                    <option key={idx} value={member}>{member}</option>
                  ))}
                </select>
                {/* Repeat rule UI */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Repeats</label>
                  <select
                    className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                    value={repeat.type}
                    onChange={e => {
                      const val = e.target.value;
                      if (val === 'none') setRepeat({ type: 'none' });
                      else if (val === 'everyday') setRepeat({ type: 'everyday' });
                      else if (val === 'weekdays') setRepeat({ type: 'weekdays' });
                      else if (val === 'weekends') setRepeat({ type: 'weekends' });
                      else if (val === 'daysOfWeek') setRepeat({ type: 'daysOfWeek', days: customDays });
                      else if (val === 'custom') setRepeat({ type: 'custom', interval: customInterval, unit: customUnit });
                    }}
                  >
                    <option value="none">Does not repeat</option>
                    <option value="everyday">Every day</option>
                    <option value="weekdays">Weekdays (Mon–Fri)</option>
                    <option value="weekends">Weekends (Sat–Sun)</option>
                    <option value="daysOfWeek">Custom days of week…</option>
                    <option value="custom">Custom interval…</option>
                  </select>
                  {repeat.type === 'daysOfWeek' && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {DAY_NAMES.map((name, i) => (
                        <label key={i} className="flex items-center gap-1 text-sm">
                          <input
                            type="checkbox"
                            checked={customDays.includes(i)}
                            onChange={e => {
                              setCustomDays(prev =>
                                e.target.checked
                                  ? [...prev, i]
                                  : prev.filter(d => d !== i)
                              );
                              setRepeat({ type: 'daysOfWeek', days: e.target.checked ? [...customDays, i] : customDays.filter(d => d !== i) });
                            }}
                          />
                          {name}
                        </label>
                      ))}
                    </div>
                  )}
                  {repeat.type === 'custom' && (
                    <div className="flex items-center gap-2 mt-2">
                      <span>Every</span>
                      <input
                        type="number"
                        min={1}
                        className="w-16 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        value={customInterval}
                        onChange={e => {
                          const val = Math.max(1, Number(e.target.value));
                          setCustomInterval(val);
                          setRepeat({ type: 'custom', interval: val, unit: customUnit });
                        }}
                      />
                      <select
                        className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        value={customUnit}
                        onChange={e => {
                          const unit = e.target.value as 'day' | 'week' | 'month';
                          setCustomUnit(unit);
                          setRepeat({ type: 'custom', interval: customInterval, unit });
                        }}
                      >
                        <option value="day">day(s)</option>
                        <option value="week">week(s)</option>
                        <option value="month">month(s)</option>
                      </select>
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-1">{getRepeatSummary(repeat)}</div>
                </div>
                {/* Deadline input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                  {repeat.type === 'none' ? (
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={tempDate}
                        onChange={e => setTempDate(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        required
                      />
                      <input
                        type="time"
                        value={deadline}
                        onChange={e => setDeadline(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        required
                      />
                    </div>
                  ) : (
                    <input
                      type="time"
                      value={deadline}
                      onChange={e => setDeadline(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      required
                    />
                  )}
                </div>
                <div className="flex gap-2 justify-end">
                  {editIndex !== null && (
                    <button
                      type="button"
                      className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded text-white transition ${members.length === 0 ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}
                    disabled={members.length === 0}
                  >
                    {editIndex !== null ? 'Save' : 'Add Reminder'}
                  </button>
                </div>
              </form>
              {reminderError && <div className="text-red-600 text-sm mb-2">{reminderError}</div>}
              {editingReminder && (
                <div className="mt-6">
                  <h4 className="text-md font-semibold mb-2 text-blue-700">Completion History</h4>
                  {editingReminder.history && editingReminder.history.length > 0 ? (
                    <ul className="text-xs text-gray-700 max-h-40 overflow-y-auto divide-y divide-gray-200">
                      {[...editingReminder.history].sort((a, b) => b.timestamp - a.timestamp).map((entry, i) => (
                        <li key={i} className="py-1 flex items-center gap-2">
                          <span className={entry.done ? 'text-green-700' : 'text-red-700'}>
                            {entry.done ? 'Completed' : 'Uncompleted'}
                          </span>
                          <span className="text-gray-400">
                            {new Date(entry.timestamp).toLocaleString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-xs text-gray-400">No completion history yet.</div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  // Floating Action Button (FAB) and menu
  const renderFab = () => (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {fabMenuOpen && (
        <div className="mb-2 flex flex-col gap-2 animate-fade-in">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-white shadow rounded-lg text-blue-700 hover:bg-blue-50 transition"
            onClick={() => { setModal('member'); setFabMenuOpen(false); }}
          >
            <span className="text-xl">👤</span> Add Member
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-white shadow rounded-lg text-blue-700 hover:bg-blue-50 transition"
            onClick={() => { setModal('reminder'); setFabMenuOpen(false); }}
            disabled={members.length === 0}
          >
            <span className="text-xl">⏰</span> Add Reminder
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-white shadow rounded-lg text-green-700 hover:bg-green-50 transition"
            onClick={generateDemoData}
          >
            <span className="text-xl">✨</span> Generate Demo Data
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-white shadow rounded-lg text-purple-700 hover:bg-purple-50 transition"
            onClick={openTimeModal}
          >
            <span className="text-xl">🕒</span> Set Date/Time
          </button>
        </div>
      )}
      <button
        className="w-16 h-16 rounded-full bg-blue-600 text-white text-4xl shadow-lg flex items-center justify-center hover:bg-blue-700 transition"
        onClick={() => setFabMenuOpen(open => !open)}
        aria-label="Add"
      >
        {fabMenuOpen ? '×' : '+'}
      </button>
    </div>
  );

  return (
    <main className="min-h-screen flex flex-col items-center justify-start pt-8 bg-gradient-to-br from-blue-100 to-blue-50 relative">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-700">Muistutin</h1>
        <div className="mt-2 flex flex-col items-center gap-1">
          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
            {mockedNow ? mockedNow.toLocaleString() : now.toLocaleString()}
          </span>
          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${mockedNow ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
            {mockedNow ? 'Mocked time' : 'Real time'}
          </span>
        </div>
      </div>

      <section className="bg-white rounded-xl shadow p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-blue-700">Reminders</h2>
          <div className="flex gap-2">
            <button
              className={`px-3 py-1 rounded ${view === 'today' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'} transition`}
              onClick={() => setView('today')}
            >
              Today
            </button>
            <button
              className={`px-3 py-1 rounded ${view === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'} transition`}
              onClick={() => setView('all')}
            >
              All
            </button>
          </div>
        </div>
        <ul className="divide-y divide-gray-200">
          {visibleReminders.length === 0 ? (
            <li className="text-gray-500 text-center py-2">No reminders{view === 'today' ? ' for today' : ''}.</li>
          ) : (
            visibleReminders.map((reminder, idx) => {
              const doneForToday = isDoneToday(reminder);
              const isLate = isReminderLate(reminder);
              const isAllView = view === 'all';
              return (
                <li
                  key={idx}
                  className={`py-2 flex items-center justify-between gap-2 ${doneForToday ? 'opacity-50' : ''} ${isLate ? 'bg-red-50' : ''} ${isAllView ? 'hover:bg-blue-50 cursor-pointer transition' : ''}`}
                  onClick={isAllView ? () => handleEditReminder(reminders.indexOf(reminder)) : undefined}
                  aria-label={isAllView ? 'Click to edit reminder' : undefined}
                >
                  <div className="flex items-center gap-2">
                    {view === 'today' && (
                      <input
                        type="checkbox"
                        checked={doneForToday}
                        onChange={() => handleToggleDone(reminders.indexOf(reminder))}
                        className="accent-blue-600 w-5 h-5"
                        aria-label={doneForToday ? 'Mark as not done' : 'Mark as done'}
                      />
                    )}
                    <div>
                      <span className={`font-medium ${doneForToday ? 'line-through' : ''}`}>{reminder.title}</span>
                      <span className="block text-sm text-gray-500">Assigned to: {reminder.assignedTo}</span>
                      <span className="block text-xs text-gray-400">{getRepeatSummary(reminder.repeat)}</span>
                      {reminder.deadline && (
                        <span className="block text-xs text-gray-500">
                          Deadline: {formatDeadline(reminder)}
                          {` (${formatTimeToDeadline(reminder)})`}
                        </span>
                      )}
                      {reminder.repeat.type !== 'none' && getLastCompletion(reminder) && (
                        <span className="block text-xs text-gray-400">{getLastCompletion(reminder)}</span>
                      )}
                    </div>
                  </div>
                  {view === 'all' && (
                    <div className="flex gap-1">
                      <button
                        className="px-2 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200 transition"
                        onClick={e => { e.stopPropagation(); handleRemoveReminder(reminders.indexOf(reminder)); }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </li>
              );
            })
          )}
        </ul>
      </section>

      {renderModal()}
      {renderFab()}
    </main>
  );
};

export default App; 