// Top navigation bar with hamburger menu (slide-out drawer)

import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Wallet,
  LayoutDashboard,
  Receipt,
  Shield,
  LogOut,
  Menu,
  X,
  Activity,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Close drawer on Escape key
  useEffect(() => {
    if (!menuOpen) return;
    const handleEsc = (e) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [menuOpen]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [menuOpen]);

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      isActive
        ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
        : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
    }`;

  return (
    <>
      {/* Top bar */}
      <nav className="sticky top-0 z-40 glass-card !rounded-none !rounded-b-2xl border-t-0 border-x-0 px-4 sm:px-8 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Hamburger + Logo grouped on the left */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text hidden sm:inline">
                SpendWise
              </span>
            </Link>
          </div>

          {/* User avatar - right */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-primary-500/30">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>
      </nav>

      {/* Drawer overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Slide-out drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-80 max-w-[85vw] glass-card !rounded-none !rounded-r-2xl border-l-0 border-y-0 transform transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Drawer header */}
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">SpendWise</span>
            </Link>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User info card */}
          <div className="glass-card p-4 mb-6 !bg-white/[0.03]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white font-semibold truncate">{user?.name}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                <span
                  className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full uppercase font-semibold ${
                    isAdmin
                      ? 'bg-accent-500/20 text-accent-300 border border-accent-500/30'
                      : 'bg-white/5 text-slate-400 border border-white/10'
                  }`}
                >
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-2 flex-1">
            <p className="text-xs uppercase tracking-wider text-slate-500 px-4 mb-1">
              Main
            </p>
            <NavLink
              to="/dashboard"
              className={navLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </NavLink>
            <NavLink
              to="/expenses"
              className={navLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              <Receipt className="w-5 h-5" />
              Expenses
            </NavLink>

            {isAdmin && (
              <>
                <p className="text-xs uppercase tracking-wider text-slate-500 px-4 mb-1 mt-4">
                  Admin
                </p>
                <NavLink
                  to="/admin/users"
                  className={navLinkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  <Shield className="w-5 h-5" />
                  Users
                </NavLink>
                <NavLink
                  to="/admin/activities"
                  className={navLinkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  <Activity className="w-5 h-5" />
                  Activities
                </NavLink>
              </>
            )}
          </nav>

          {/* Logout button at bottom */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-red-500/10 border border-red-500/30 rounded-xl transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Navbar;