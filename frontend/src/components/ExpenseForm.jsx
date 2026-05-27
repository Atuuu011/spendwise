// Form for creating/editing an expense - used inside Modal

import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Other'];

const ExpenseForm = ({ initialData = null, onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: 'Other',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [saving, setSaving] = useState(false);

  // Populate form when editing an existing expense
  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        amount: initialData.amount?.toString() || '',
        category: initialData.category || 'Other',
        description: initialData.description || '',
        date: initialData.date
          ? new Date(initialData.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
      });
    }
  }, [initialData]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required');
    if (!form.amount || parseFloat(form.amount) < 0) return toast.error('Valid amount required');

    setSaving(true);
    try {
      await onSubmit({
        title: form.title.trim(),
        amount: parseFloat(form.amount),
        category: form.category,
        description: form.description.trim(),
        date: form.date,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="glass-input"
          placeholder="e.g. Lunch at cafe"
          autoFocus
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Amount ($)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            className="glass-input"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="glass-input cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-dark-800">
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="glass-input"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Description <span className="text-slate-500 text-xs">(optional)</span>
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="2"
          className="glass-input resize-none"
          placeholder="Add a note..."
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
          {saving ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              {initialData ? 'Update' : 'Save'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;