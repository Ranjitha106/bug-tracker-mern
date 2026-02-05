import { useState } from 'react';
import api from '../api/axios';

const Settings = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [name, setName] = useState(user.name || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await api.put('/auth/profile', { name });
      localStorage.setItem('user', JSON.stringify(res.data));
      alert('Profile updated successfully!');
      window.location.reload();
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      {/* PAGE TITLE */}
      <h1 className="text-4xl font-extrabold text-slate-900 mb-10 tracking-tight">
        Settings
      </h1>

      {/* CARD */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* CARD HEADER */}
        <div className="p-8 bg-slate-50 border-b border-slate-200">
          <h2 className="text-xl font-extrabold text-slate-800">
            Profile Information
          </h2>
          <p className="text-sm text-slate-500">
            Update your personal identification
          </p>
        </div>

        {/* FORM */}
        <div className="p-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* NAME */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 rounded-2xl bg-white 
                border border-slate-300 
                focus:border-purple-400 
                focus:ring-2 focus:ring-purple-100 
                outline-none font-semibold text-slate-700 transition"
              />
            </div>

            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                Email Address
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full p-4 rounded-2xl bg-slate-100 
                border border-slate-200 
                text-slate-400 font-semibold cursor-not-allowed"
              />
            </div>
          </div>

          {/* SAVE BUTTON */}
          <div className="pt-6 border-t border-slate-200">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-10 py-4 rounded-2xl 
              bg-purple-600 hover:bg-purple-700 
              text-white font-extrabold 
              shadow-md transition-all 
              active:scale-95 disabled:opacity-50"
            >
              {loading ? 'SAVING…' : 'SAVE CHANGES'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
