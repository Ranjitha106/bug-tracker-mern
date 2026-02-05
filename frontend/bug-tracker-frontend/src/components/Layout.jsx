import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '⊞' },
    { name: 'Projects', path: '/projects', icon: '📁' },
    { name: 'Members', path: '/members', icon: '👥' },
    { name: 'Settings', path: '/settings', icon: '⚙' },
  ];

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900">

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-200 border-r border-slate-300 flex flex-col">

        {/* LOGO */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-300">
          <div className="bg-yellow-400 text-black px-3 py-2 rounded-lg font-black">
            🐞
          </div>
          <span className="text-xl font-extrabold tracking-tight">
            Bug Tracker
          </span>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  active
                    ? 'bg-white shadow-sm text-slate-900'
                    : 'text-slate-600 hover:bg-white/70'
                }`}
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t border-slate-300">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold
            text-slate-600 hover:text-red-600 hover:bg-red-100 transition"
          >
            ⎗ Logout
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/* TOP NAVBAR */}
        <header className="h-20 bg-slate-200 border-b border-slate-300 flex items-center justify-end px-8">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-4 hover:opacity-80 transition"
            >
              <div className="text-right leading-tight">
                <p className="text-sm font-bold text-slate-800">
                  {user.name || 'User'}
                </p>
                {/* REMOVED USER ROLE PARAGRAPH FROM HERE */}
              </div>

              <div className="w-10 h-10 rounded-full bg-yellow-400 text-black font-extrabold flex items-center justify-center">
                {user.name?.[0] || 'U'}
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
                <Link
                  to="/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="block px-4 py-3 text-sm hover:bg-slate-100"
                >
                  ⚙ Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-red-100 text-red-600"
                >
                  ⎗ Sign Out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;