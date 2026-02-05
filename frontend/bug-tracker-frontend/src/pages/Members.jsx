import { useState, useEffect } from 'react';
import api from '../api/axios';

const Members = () => {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get('/auth/users');
        const projRes = await api.get('/projects');
        setUsers(userRes.data);
        setProjects(projRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching members:', err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddMember = async (projectId, memberId) => {
    try {
      await api.post('/projects/add-member', { projectId, memberId });
      alert('Member added to project successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add member');
    }
  };

  if (loading)
    return (
      <div className="p-12 text-center text-slate-400 font-semibold">
        Loading members…
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2">
          Workspace Members
        </h1>
        <p className="text-slate-500 font-medium">
          Manage users and assign them to projects.
        </p>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-6 text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                User
              </th>
              <th className="p-6 text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                Email
              </th>
              <th className="p-6 text-xs font-extrabold text-slate-400 uppercase tracking-wider text-right">
                Assign to Project
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b border-slate-100 hover:bg-purple-50/40 transition"
              >
                {/* USER */}
                <td className="p-6 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-extrabold uppercase">
                    {user.name?.[0]}
                  </div>
                  <span className="font-bold text-slate-800">
                    {user.name}
                  </span>
                </td>

                {/* EMAIL */}
                <td className="p-6 text-slate-500 text-sm">
                  {user.email}
                </td>

                {/* SELECT */}
                <td className="p-6 text-right">
                  <select
                    onChange={(e) =>
                      handleAddMember(e.target.value, user._id)
                    }
                    className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-700
                    focus:ring-2 focus:ring-purple-200 outline-none transition"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select Project
                    </option>
                    {projects.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Members;
