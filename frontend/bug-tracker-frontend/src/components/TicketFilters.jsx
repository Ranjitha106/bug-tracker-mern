const TicketFilters = ({ searchTerm, setSearchTerm, priorityFilter, setPriorityFilter }) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
      <div className="flex-1 min-w-[200px]">
        <input 
          type="text" 
          placeholder="Search tickets by title..." 
          className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <select 
        className="p-2 border border-gray-200 rounded-lg outline-none"
        value={priorityFilter}
        onChange={(e) => setPriorityFilter(e.target.value)}
      >
        <option value="all">All Priorities</option>
        <option value="high">High Only</option>
        <option value="medium">Medium Only</option>
        <option value="low">Low Only</option>
      </select>
    </div>
  );
};

export default TicketFilters;