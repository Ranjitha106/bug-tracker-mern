import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/projects');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-800">
      <form
        onSubmit={handleSubmit}
        className="w-96 p-8 rounded-2xl bg-slate-900 shadow-2xl border border-slate-700"
      >
        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-yellow-400 text-black flex items-center justify-center text-xl font-black">
            🐞
          </div>
        </div>

        <h2 className="text-2xl font-extrabold text-white text-center mb-1">
          Bug Tracker
        </h2>
        <p className="text-center text-slate-400 mb-8">
          Sign in to your workspace
        </p>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 rounded-xl bg-slate-800 border border-slate-700
          text-white placeholder-slate-400
          focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
          outline-none transition"
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          required
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 rounded-xl bg-slate-800 border border-slate-700
          text-white placeholder-slate-400
          focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
          outline-none transition"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />

        {/* BUTTON */}
        <button
          className="w-full py-3 rounded-xl font-bold text-white
          bg-indigo-600 hover:bg-indigo-700
          transition shadow-lg active:scale-[0.98]"
        >
          Login
        </button>

        {/* FOOTER */}
        <p className="mt-6 text-center text-sm text-slate-400">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="font-bold text-indigo-400 hover:text-indigo-300 transition"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
