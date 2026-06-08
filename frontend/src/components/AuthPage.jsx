import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, LayoutGrid } from 'lucide-react';

const AuthPage = () => {
  const { login, register, error, setError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setError(null);
    setFormData({ name: '', email: '', password: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    let result;
    if (isLogin) {
      result = await login(formData.email, formData.password);
    } else {
      result = await register(formData.name, formData.email, formData.password);
    }
    setLoading(false);

    if (result && !result.success) {
      // Errors are handled by the Context API and set in the error state
      console.log('Auth error:', result.error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-zinc-950 text-zinc-100">
      {/* Brand Icon/Logo */}
      <div className="flex items-center space-x-2.5 mb-8">
        <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl">
          <LayoutGrid size={28} className="text-zinc-300" />
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent tracking-wide">
          Kanban Board
        </span>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800/80 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="text-sm text-zinc-400 font-light">
            {isLogin
              ? 'Enter your credentials to access your board'
              : 'Sign up to start organizing your projects'}
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-400 bg-red-950/20 border border-red-900/50 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field (Sign Up Only) */}
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-600">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:outline-none focus:border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder-zinc-700 transition-colors"
                  required
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-600">
                <Mail size={18} />
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:outline-none focus:border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder-zinc-700 transition-colors"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-600">
                <Lock size={18} />
              </span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:outline-none focus:border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder-zinc-700 transition-colors"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 mt-6 bg-zinc-100 text-zinc-950 hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none font-semibold rounded-lg text-sm transition-all shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center space-x-2">
                <svg className="animate-spin h-4 w-4 text-zinc-950" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Processing...</span>
              </span>
            ) : isLogin ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Toggle Option */}
        <div className="text-center pt-2">
          <button
            onClick={handleToggle}
            className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
