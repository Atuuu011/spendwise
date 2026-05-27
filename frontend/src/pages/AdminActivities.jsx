// Admin page - view all user activities

import { useEffect, useState } from 'react';
import { Activity, LogIn, LogOut, UserPlus, Plus, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import api from '../services/api';
import { formatDateTime } from '../utils/formatters';

const ACTION_ICONS = {
  LOGIN: { icon: LogIn, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  LOGOUT: { icon: LogOut, color: 'text-slate-400 bg-slate-500/10 border-slate-500/30' },
  REGISTER: { icon: UserPlus, color: 'text-primary-400 bg-primary-500/10 border-primary-500/30' },
  CREATE_EXPENSE: { icon: Plus, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
  UPDATE_EXPENSE: { icon: Edit2, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' },
  DELETE_EXPENSE: { icon: Trash2, color: 'text-red-400 bg-red-500/10 border-red-500/30' },
};

const AdminActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const { data } = await api.get('/activities');
      setActivities(data.activities);
    } catch (err) {
      toast.error('Failed to load activities');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-decoration min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-2">
            <Activity className="w-7 h-7 text-primary-400" />
            User Activities
          </h1>
          <p className="text-slate-400">{activities.length} recent activities (latest first)</p>
        </div>

        {loading ? (
          <Loader text="Loading activities..." />
        ) : activities.length === 0 ? (
          <div className="glass-card p-12 text-center animate-fade-in">
            <Activity className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No activities yet</p>
          </div>
        ) : (
          <div className="space-y-2 animate-fade-in">
            {activities.map((act) => {
              const meta = ACTION_ICONS[act.action] || ACTION_ICONS.LOGIN;
              const Icon = meta.icon;
              return (
                <div key={act._id} className="glass-card p-4 flex items-center gap-4 hover:scale-[1.01] transition-transform">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${meta.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-white font-medium">{act.user?.name || 'Deleted user'}</span>
                      <span className="text-xs text-slate-500">{act.user?.email || ''}</span>
                    </div>
                    <p className="text-sm text-slate-300">
                      <span className="font-mono text-xs bg-white/5 px-2 py-0.5 rounded mr-2">{act.action}</span>
                      {act.details}
                    </p>
                  </div>
                  <div className="text-xs text-slate-500 text-right shrink-0">{formatDateTime(act.createdAt)}</div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminActivities;