// Reusable stat card for the dashboard

const StatCard = ({ icon: Icon, label, value, gradient = 'from-primary-500 to-accent-500' }) => (
  <div className="glass-card p-6 hover:scale-[1.02] transition-transform duration-300 animate-fade-in">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-400 mb-1">{label}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

export default StatCard;