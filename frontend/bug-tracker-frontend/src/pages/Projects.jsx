import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', formData);
      setShowCreateModal(false);
      setFormData({ name: '', description: '' });
      fetchProjects();
    } catch (err) {
      alert('Failed to create project.');
    }
  };

  const openEditModal = (project) => {
    setCurrentProject(project);
    setFormData({ name: project.name, description: project.description });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/projects/${currentProject._id}`, formData);
      setShowEditModal(false);
      fetchProjects();
    } catch (err) {
      alert('Failed to update project.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/projects/${id}`);
        fetchProjects();
      } catch (err) {
        alert('Failed to delete project.');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-1">
            Projects
          </h1>
          <p className="text-slate-500 font-medium">
            Manage and track your active workspace.
          </p>

          {/* SEARCH */}
          <div className="relative mt-6 max-w-md">
            <span className="absolute left-4 top-3.5 text-slate-400">🔍</span>
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm focus:ring-2 focus:ring-purple-100 outline-none transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={() => {
            setFormData({ name: '', description: '' });
            setShowCreateModal(true);
          }}
          className="h-fit bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-extrabold shadow-md transition flex items-center gap-2"
        >
          <span className="text-xl">+</span> New Project
        </button>
      </div>

      {/* PROJECT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((p) => (
          <div
            key={p._id}
            className="relative bg-white rounded-3xl p-6 
            border border-slate-200 
            shadow-sm 
            hover:shadow-md 
            hover:border-purple-300 
            transition-all duration-300 group"
          >
            {/* ACTIONS */}
            <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition">
              <button
                onClick={() => openEditModal(p)}
                className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition"
              >
                ✎
              </button>
              <button
                onClick={() => handleDelete(p._id)}
                className="p-2 bg-red-100 text-red-500 rounded-lg hover:bg-red-200 transition"
              >
                🗑
              </button>
            </div>

            <h3 className="text-xl font-extrabold text-slate-800 mb-2 truncate pr-16">
              {p.name}
            </h3>

            <p className="text-sm text-slate-500 mb-6 line-clamp-2 min-h-[40px]">
              {p.description || 'No description provided.'}
            </p>

            <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-6">
              <span>👥 {p.members?.length || 1} members</span>
              <span>📅 {new Date(p.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="px-3 py-1 text-[10px] font-extrabold rounded-full bg-emerald-100 text-emerald-700 tracking-widest">
                ACTIVE
              </span>
              <button
                onClick={() => navigate(`/projects/${p._id}/tickets`)}
                className="text-purple-600 font-extrabold hover:text-purple-800 transition"
              >
                View Board →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-24 mt-10 bg-white rounded-3xl border border-dashed border-slate-200">
          <p className="text-slate-400 font-medium">
            {searchTerm
              ? `No projects matching "${searchTerm}"`
              : 'No projects found.'}
          </p>
        </div>
      )}

      {/* MODALS */}
      {showCreateModal && (
        <ProjectModal
          title="Create New Project"
          onSubmit={handleCreate}
          onClose={() => setShowCreateModal(false)}
          formData={formData}
          setFormData={setFormData}
          buttonText="Create Project"
        />
      )}
      {showEditModal && (
        <ProjectModal
          title="Edit Project"
          onSubmit={handleUpdate}
          onClose={() => setShowEditModal(false)}
          formData={formData}
          setFormData={setFormData}
          buttonText="Save Changes"
        />
      )}
    </div>
  );
};

const ProjectModal = ({
  title,
  onSubmit,
  onClose,
  formData,
  setFormData,
  buttonText,
}) => (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <form
      onSubmit={onSubmit}
      className="bg-white p-8 rounded-3xl w-full max-w-md shadow-xl"
    >
      <h2 className="text-2xl font-extrabold text-slate-800 mb-6">
        {title}
      </h2>

      <div className="space-y-5">
        <input
          placeholder="Project Name"
          className="w-full p-3 rounded-xl bg-slate-50 focus:ring-2 focus:ring-purple-100 outline-none font-medium"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          required
        />

        <textarea
          placeholder="Description"
          className="w-full p-3 rounded-xl bg-slate-50 focus:ring-2 focus:ring-purple-100 outline-none h-32 resize-none font-medium"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>

      <div className="flex justify-end gap-4 mt-8">
        <button
          type="button"
          onClick={onClose}
          className="font-bold text-slate-400 hover:text-slate-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold shadow-md transition"
        >
          {buttonText}
        </button>
      </div>
    </form>
  </div>
);

export default Projects;
