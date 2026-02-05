import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const TicketDetails = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTicketAndComments();
  }, [ticketId]);

  const fetchTicketAndComments = async () => {
    try {
      setLoading(true);
      // Fetches the specific ticket details
      const ticketRes = await api.get(`/tickets/detail/${ticketId}`);
      setTicket(ticketRes.data);
      
      // Fetches comments for this ticket
      const commentsRes = await api.get(`/comments/${ticketId}`);
      setComments(commentsRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data", err);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await api.put(`/tickets/${ticketId}`, { status: newStatus });
      setTicket({ ...ticket, status: newStatus });
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await api.post('/comments', {
        ticketId: ticketId,
        text: newComment
      });
      setNewComment('');
      // Refresh comments after posting
      const commentsRes = await api.get(`/comments/${ticketId}`);
      setComments(commentsRes.data);
    } catch (err) {
      alert("Failed to post comment");
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500 font-bold">Loading Ticket Details...</div>;
  if (!ticket) return <div className="p-10 text-center text-red-500">Ticket not found.</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 text-blue-600 font-bold hover:text-blue-800 flex items-center gap-2 transition"
      >
        ← Back to Board
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Ticket Info Section */}
        <div className="p-8 border-b border-gray-50">
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
                ticket.priority === 'high' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
              }`}>
                {ticket.priority} Priority
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-[10px] font-black uppercase">
                {ticket.project?.name || 'Project'}
              </span>
            </div>
            <select 
              value={ticket.status || 'todo'} 
              onChange={(e) => handleStatusUpdate(e.target.value)}
              className="bg-gray-50 border-none rounded-xl p-2 text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          
          <h1 className="text-3xl font-black text-slate-900 mb-4">{ticket.title}</h1>
          <div className="bg-slate-50 p-6 rounded-2xl mb-4">
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
              {ticket.description || "No description provided."}
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
            {/* UPDATED: Only shows assignee name if it exists, otherwise hides the entire span */}
            {ticket.assignee?.name && (
              <>
                <span>Assignee: <span className="text-slate-800">{ticket.assignee.name}</span></span>
                <span>•</span>
              </>
            )}
            <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Comments Section */}
        <div className="p-8 bg-gray-50/30">
          <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
            Discussion <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-md text-xs">{comments.length}</span>
          </h2>

          <div className="space-y-4 mb-8">
            {comments.map((c) => (
              <div key={c._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold">
                      {c.user?.name?.[0]}
                    </div>
                    <span className="font-bold text-sm text-slate-800">{c.user?.name}</span>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handlePostComment} className="relative bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
            <textarea 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-4 bg-white border-none rounded-xl focus:ring-0 outline-none text-slate-700 resize-none h-24 text-sm"
              placeholder="Add your thoughts or updates..."
            />
            <div className="flex justify-end p-2 border-t border-gray-50">
              <button 
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold text-xs shadow-lg shadow-blue-100 hover:bg-blue-700 transition"
              >
                Post Comment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;