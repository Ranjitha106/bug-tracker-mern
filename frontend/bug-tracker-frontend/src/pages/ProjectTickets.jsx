import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const ProjectTickets = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const [tickets, setTickets] = useState([]);
  const [activeColumn, setActiveColumn] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(null);
  
  // --- NEW: FILTER STATES ---
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const [ticketData, setTicketData] = useState({ 
    title: '', 
    description: '', 
    priority: 'medium', 
    projectId 
  });

  useEffect(() => {
    fetchTickets();
  }, [projectId]);

  const fetchTickets = async () => {
    try {
      const res = await api.get(`/tickets/${projectId}`);
      setTickets(res.data);
    } catch (err) {
      console.error("Error fetching tickets", err);
    }
  };

  // --- NEW: FILTERING LOGIC ---
  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tickets', ticketData);
      setIsModalOpen(false);
      setTicketData({ title: '', description: '', priority: 'medium', projectId });
      fetchTickets();
    } catch (err) {
      alert("Failed to create ticket");
    }
  };

  const openEditModal = (ticket) => {
    setCurrentTicket(ticket);
    setTicketData({
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority,
      projectId
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/tickets/${currentTicket._id}`, ticketData);
      setIsEditModalOpen(false);
      fetchTickets();
    } catch (err) {
      alert("Failed to update ticket");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      try {
        await api.delete(`/tickets/${id}`);
        fetchTickets();
      } catch (err) {
        alert("Failed to delete ticket");
      }
    }
  };

  const onDragStart = (e, ticketId) => {
    e.dataTransfer.setData("ticketId", ticketId);
  };

  const onDrop = async (e, newStatus) => {
    setActiveColumn(null);
    const ticketId = e.dataTransfer.getData("ticketId");
    
    const updatedTickets = tickets.map(t => 
      t._id === ticketId ? { ...t, status: newStatus } : t
    );
    setTickets(updatedTickets);

    try {
      await api.put(`/tickets/${ticketId}`, { status: newStatus });
    } catch (err) {
      fetchTickets(); 
    }
  };

  const columns = [
    { id: 'todo', label: 'TODO' },
    { id: 'in-progress', label: 'IN PROGRESS' },
    { id: 'done', label: 'DONE' }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header & Main Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-1">Project Board</h1>
          <p className="text-gray-500 font-medium text-sm">Find, filter, and manage project tickets.</p>
        </div>
        <button 
          onClick={() => {
            setTicketData({ title: '', description: '', priority: 'medium', projectId });
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
        >
          <span className="text-xl">+</span> Create Ticket
        </button>
      </div>

      {/* --- NEW: SEARCH & FILTER BAR --- */}
      <div className="flex flex-wrap gap-4 mb-8 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex-1 min-w-[250px] relative">
          <span className="absolute left-4 top-3 text-gray-400">🔍</span>
          <input 
            type="text" 
            placeholder="Search tickets by title..." 
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-bold text-slate-600 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="all">All Priorities</option>
          <option value="high">High Only</option>
          <option value="medium">Medium Only</option>
          <option value="low">Low Only</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {columns.map(col => (
          <div 
            key={col.id} 
            onDragOver={(e) => { e.preventDefault(); setActiveColumn(col.id); }}
            onDragLeave={() => setActiveColumn(null)}
            onDrop={(e) => onDrop(e, col.id)}
            className={`bg-gray-100/40 rounded-3xl p-4 min-h-[600px] border-2 transition-all duration-200 flex flex-col ${
              activeColumn === col.id ? 'border-blue-400 bg-blue-50/50' : 'border-transparent'
            }`}
          >
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 px-2 flex justify-between">
              {col.label} 
              <span className="bg-gray-200 text-gray-600 px-2 rounded-md">
                {/* Updated to use filteredTickets for the count */}
                {filteredTickets.filter(t => (t.status || 'todo') === col.id).length}
              </span>
            </h2>
            
            <div className="space-y-4 flex-1">
              {/* --- UPDATED: Mapping over filteredTickets instead of tickets --- */}
              {filteredTickets.filter(t => (t.status || 'todo') === col.id).map(t => (
                <div 
                  key={t._id}
                  draggable
                  onDragStart={(e) => onDragStart(e, t._id)}
                  className="bg-white p-6 rounded-2xl border border-transparent shadow-sm hover:shadow-md hover:border-blue-100 transition cursor-move group relative animate-in fade-in duration-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${
                      t.priority === 'high' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                    }`}>
                      {t.priority}
                    </span>
                    
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); openEditModal(t); }}
                        className="p-1 hover:bg-blue-50 text-blue-600 rounded transition"
                      >
                        ✎
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(t._id); }}
                        className="p-1 hover:bg-red-50 text-red-500 rounded transition"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-slate-800 mb-4 group-hover:text-blue-600 transition">
                    {t.title}
                  </h3>

                  <button 
                    onClick={() => navigate(`/tickets/${t._id}`)}
                    className="text-[10px] font-black text-gray-400 hover:text-blue-600 uppercase tracking-widest"
                  >
                    Details →
                  </button>
                </div>
              ))}
              
              {/* Empty state within column */}
              {filteredTickets.filter(t => (t.status || 'todo') === col.id).length === 0 && (
                <div className="py-10 text-center text-xs text-gray-300 font-bold uppercase tracking-widest">
                  No tickets
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <TicketModal 
          title="Create New Ticket"
          onSubmit={handleCreate}
          onClose={() => setIsModalOpen(false)}
          data={ticketData}
          setData={setTicketData}
          buttonText="Create Ticket"
        />
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <TicketModal 
          title="Edit Ticket"
          onSubmit={handleUpdate}
          onClose={() => setIsEditModalOpen(false)}
          data={ticketData}
          setData={setTicketData}
          buttonText="Save Changes"
        />
      )}
    </div>
  );
};

const TicketModal = ({ title, onSubmit, onClose, data, setData, buttonText }) => (
  <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <form onSubmit={onSubmit} className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl border border-white animate-in fade-in zoom-in duration-200">
      <h2 className="text-2xl font-black text-slate-800 mb-6">{title}</h2>
      <div className="space-y-4">
        <input 
          className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-100 outline-none font-medium text-slate-700" 
          placeholder="Ticket Title" 
          value={data.title}
          onChange={e => setData({...data, title: e.target.value})} 
          required 
        />
        <textarea 
          className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-100 outline-none h-28 font-medium text-slate-700 resize-none" 
          placeholder="Describe the issue..." 
          value={data.description}
          onChange={e => setData({...data, description: e.target.value})} 
        />
        <select 
          className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-100 outline-none font-bold text-gray-500"
          value={data.priority}
          onChange={e => setData({...data, priority: e.target.value})}
        >
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
          <option value="low">Low Priority</option>
        </select>
      </div>
      <div className="flex justify-end gap-3 mt-8">
        <button type="button" onClick={onClose} className="px-6 py-3 text-gray-400 font-bold hover:text-slate-800 transition">Cancel</button>
        <button type="submit" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition">{buttonText}</button>
      </div>
    </form>
  </div>
);

export default ProjectTickets;