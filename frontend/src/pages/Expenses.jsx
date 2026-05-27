// Expenses page - full CRUD with live search

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Receipt } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import ExpenseForm from '../components/ExpenseForm';
import api from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import { formatCurrency, formatDate, categoryIcon, categoryColor } from '../utils/formatters';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300); // wait 300ms after typing stops
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  // Fetch expenses whenever debounced search changes
  useEffect(() => {
    fetchExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const params = debouncedSearch ? { search: debouncedSearch } : {};
      const { data } = await api.get('/expenses', { params });
      setExpenses(data.expenses);
    } catch (err) {
      toast.error('Failed to load expenses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData) => {
    try {
      await api.post('/expenses', formData);
      toast.success('Expense added! 🎉');
      setModalOpen(false);
      setEditingExpense(null);
      fetchExpenses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create expense');
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await api.put(`/expenses/${editingExpense._id}`, formData);
      toast.success('Expense updated! ✨');
      setModalOpen(false);
      setEditingExpense(null);
      fetchExpenses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update expense');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense? This cannot be undone.')) return;
    try {
      await api.delete(`/expenses/${id}`);
      toast.success('Expense deleted');
      fetchExpenses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const openCreateModal = () => {
    setEditingExpense(null);
    setModalOpen(true);
  };

  const openEditModal = (expense) => {
    setEditingExpense(expense);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingExpense(null);
  };

  return (
    <div className="bg-decoration min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Expenses</h1>
            <p className="text-slate-400">Track and manage your spending</p>
          </div>
          <button onClick={openCreateModal} className="btn-primary flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            Add Expense
          </button>
        </div>

        {/* Search bar */}
        <div className="mb-6 animate-fade-in">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search expenses by title or description..."
          />
          {debouncedSearch && (
            <p className="text-sm text-slate-400 mt-2">
              Showing results for "<span className="text-primary-400">{debouncedSearch}</span>"
            </p>
          )}
        </div>

        {/* Expenses list */}
        {loading ? (
          <Loader text="Loading expenses..." />
        ) : expenses.length === 0 ? (
          <div className="glass-card p-12 text-center animate-fade-in">
            <Receipt className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {debouncedSearch ? 'No expenses match your search' : 'No expenses yet'}
            </h3>
            <p className="text-slate-400 mb-6">
              {debouncedSearch
                ? 'Try a different search term'
                : 'Start tracking by adding your first expense'}
            </p>
            {!debouncedSearch && (
              <button onClick={openCreateModal} className="btn-primary inline-flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add your first expense
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {expenses.map((exp) => (
              <div
                key={exp._id}
                className="glass-card p-5 hover:scale-[1.02] transition-transform duration-300 animate-fade-in"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{categoryIcon[exp.category] || '📦'}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${
                        categoryColor[exp.category] || categoryColor.Other
                      }`}
                    >
                      {exp.category}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditModal(exp)}
                      className="p-2 text-slate-400 hover:text-primary-400 hover:bg-white/5 rounded-lg transition-all"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(exp._id)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1 truncate">{exp.title}</h3>
                <p className="text-2xl font-bold gradient-text mb-2">{formatCurrency(exp.amount)}</p>
                {exp.description && (
                  <p className="text-sm text-slate-400 mb-2 line-clamp-2">{exp.description}</p>
                )}
                <p className="text-xs text-slate-500">{formatDate(exp.date)}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create/Edit modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingExpense ? 'Edit Expense' : 'Add Expense'}
      >
        <ExpenseForm
          initialData={editingExpense}
          onSubmit={editingExpense ? handleUpdate : handleCreate}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};

export default Expenses;