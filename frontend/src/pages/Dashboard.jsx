// Dashboard page - overview with stats, pie chart, and monthly bar chart

import { useEffect, useState } from 'react';
import { Wallet, TrendingUp, Calendar, Receipt, BarChart3 } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import Loader from '../components/Loader';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';

// Color palette for the pie chart
const CHART_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#64748b'];

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch stats summary + all expenses in parallel for performance
      const [statsRes, expensesRes] = await Promise.all([
        api.get('/expenses/stats/summary'),
        api.get('/expenses'),
      ]);
      setStats(statsRes.data.stats);
      setExpenses(expensesRes.data.expenses || []);
    } catch (err) {
      toast.error('Failed to load dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Pie chart data (category breakdown)
  const pieData =
    stats?.byCategory?.map((c) => ({
      name: c._id,
      value: c.total,
    })) || [];

  // Build last-6-months bar chart data from raw expenses
  const buildMonthlyData = () => {
    const months = [];
    const now = new Date();

    // Generate last 6 months (oldest first)
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: d.toLocaleDateString('en-US', { month: 'short' }),
        total: 0,
      });
    }

    // Sum amounts into the matching month bucket
    expenses.forEach((exp) => {
      const d = new Date(exp.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const bucket = months.find((m) => m.key === key);
      if (bucket) bucket.total += exp.amount;
    });

    return months;
  };

  const monthlyData = buildMonthlyData();

  return (
    <div className="bg-decoration min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* Greeting */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Welcome back,{' '}
            <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-slate-400">Here's your spending overview.</p>
        </div>

        {loading ? (
          <Loader size="lg" text="Loading dashboard..." />
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <StatCard
                icon={Wallet}
                label="Total Spent"
                value={formatCurrency(stats?.total)}
                gradient="from-primary-500 to-accent-500"
              />
              <StatCard
                icon={Calendar}
                label="This Month"
                value={formatCurrency(stats?.thisMonth)}
                gradient="from-emerald-500 to-teal-500"
              />
              <StatCard
                icon={Receipt}
                label="Total Expenses"
                value={stats?.count || 0}
                gradient="from-pink-500 to-rose-500"
              />
            </div>

            {/* Pie chart - category breakdown (UNCHANGED) */}
            <div className="glass-card p-6 animate-fade-in mb-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-primary-400" />
                <h2 className="text-xl font-bold text-white">Spending by Category</h2>
              </div>

              {pieData.length === 0 ? (
                <div className="py-12 text-center">
                  <Receipt className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">
                    No expenses yet. Start tracking your spending!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Pie chart */}
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {pieData.map((_, i) => (
                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: 'rgba(15, 23, 42, 0.95)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            color: '#fff',
                          }}
                          formatter={(value) => formatCurrency(value)}
                        />
                        <Legend wrapperStyle={{ color: '#94a3b8' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Breakdown list */}
                  <div className="space-y-3">
                    {stats.byCategory.map((cat, i) => (
                      <div
                        key={cat._id}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                          />
                          <div>
                            <p className="text-white font-medium">{cat._id}</p>
                            <p className="text-xs text-slate-400">
                              {cat.count} {cat.count === 1 ? 'expense' : 'expenses'}
                            </p>
                          </div>
                        </div>
                        <p className="text-white font-semibold">
                          {formatCurrency(cat.total)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* NEW: Monthly spending bar chart */}
            <div className="glass-card p-6 animate-fade-in">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-5 h-5 text-accent-400" />
                <h2 className="text-xl font-bold text-white">Monthly Spending Trend</h2>
                <span className="text-xs text-slate-400 ml-auto">Last 6 months</span>
              </div>

              {expenses.length === 0 ? (
                <div className="py-12 text-center">
                  <BarChart3 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">Add expenses to see trends</p>
                </div>
              ) : (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9} />
                          <stop offset="100%" stopColor="#6366f1" stopOpacity={0.6} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis
                        dataKey="label"
                        stroke="#94a3b8"
                        style={{ fontSize: '12px' }}
                        tickLine={false}
                        axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                      />
                      <YAxis
                        stroke="#94a3b8"
                        style={{ fontSize: '12px' }}
                        tickLine={false}
                        axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip
                        contentStyle={{
                          background: 'rgba(15, 23, 42, 0.95)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '12px',
                          color: '#fff',
                        }}
                        cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }}
                        formatter={(value) => [formatCurrency(value), 'Spent']}
                      />
                      <Bar
                        dataKey="total"
                        fill="url(#barGradient)"
                        radius={[8, 8, 0, 0]}
                        animationDuration={800}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;