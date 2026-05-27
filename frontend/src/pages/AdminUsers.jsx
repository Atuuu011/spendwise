// Admin page - view & delete users

import { useEffect, useState } from 'react';
import { Users, Trash2, Shield, ShieldCheck, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import api from '../services/api';
import { formatDate } from '../utils/formatters';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data.users);
    } catch (err) {
      toast.error('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}" and all their data? This cannot be undone.`)) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="bg-decoration min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-2">
              <Shield className="w-7 h-7 text-primary-400" />
              User Management
            </h1>
            <p className="text-slate-400">{users.length} total users</p>
          </div>
          <Link to="/admin/activities" className="btn-secondary flex items-center justify-center gap-2">
            <Activity className="w-5 h-5" />
            View Activities
          </Link>
        </div>

        {loading ? (
          <Loader text="Loading users..." />
        ) : (
          <div className="glass-card overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Name</th>
                    <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Email</th>
                    <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Role</th>
                    <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4 hidden md:table-cell">Joined</th>
                    <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center text-slate-400 py-12">
                        <Users className="w-12 h-12 mx-auto mb-2 text-slate-600" />
                        No users yet
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold text-sm">
                              {u.name?.[0]?.toUpperCase()}
                            </div>
                            <span className="text-white font-medium">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-300">{u.email}</td>
                        <td className="px-6 py-4">
                          {u.role === 'admin' ? (
                            <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-accent-500/20 text-accent-300 border border-accent-500/30 rounded-full">
                              <ShieldCheck className="w-3 h-3" /> Admin
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-1 bg-white/5 text-slate-300 border border-white/10 rounded-full">
                              User
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-sm hidden md:table-cell">{formatDate(u.createdAt)}</td>
                        <td className="px-6 py-4 text-right">
                          {u.role !== 'admin' && (
                            <button
                              onClick={() => handleDelete(u._id, u.name)}
                              className="btn-danger inline-flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" /> Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminUsers;