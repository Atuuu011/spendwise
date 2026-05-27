// 404 Not Found page - shown when user visits a non-existent route

import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="bg-decoration min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg text-center animate-slide-up">
        {/* Big 404 with gradient */}
        <h1 className="text-9xl font-extrabold gradient-text leading-none mb-2">
          404
        </h1>

        {/* Glass card with the message */}
        <div className="glass-card p-8 mt-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            Page not found
          </h2>
          <p className="text-slate-400 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <Link
            to="/dashboard"
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Go to Dashboard
          </Link>
        </div>

        {/* Helpful hint at bottom */}
        <p className="text-sm text-slate-500 mt-6">
          Lost? Check the URL or head back home.
        </p>
      </div>
    </div>
  );
};

export default NotFound;