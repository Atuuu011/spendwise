// Reusable formatting helpers - used throughout the UI

// Format a number as currency (e.g. 1234.5 → "$1,234.50")
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount || 0);
};

// Format a date (e.g. "2026-05-27" → "May 27, 2026")
export const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format date + time (e.g. "May 27, 2026, 3:45 PM")
export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

// Category → emoji icon mapping
export const categoryIcon = {
  Food: '🍔',
  Travel: '✈️',
  Shopping: '🛍️',
  Bills: '💡',
  Entertainment: '🎬',
  Other: '📦',
};

// Category → tailwind color class
export const categoryColor = {
  Food: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  Travel: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Shopping: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  Bills: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  Entertainment: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Other: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
};