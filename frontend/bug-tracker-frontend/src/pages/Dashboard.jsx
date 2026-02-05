import { useState, useEffect } from "react";
import api from "../api/axios";

const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    tickets: 0,
    todo: 0,
    done: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/projects/stats");
        setStats(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Stats fetch error", err);
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="p-16 text-center text-purple-600 font-black text-xl animate-pulse">
        GENERATING ANALYTICS…
      </div>
    );

  const cardData = [
    {
      label: "Active Projects",
      value: stats.projects,
      gradient: "from-blue-500 to-indigo-500",
      icon: "📁",
    },
    {
      label: "Total Tickets",
      value: stats.tickets,
      gradient: "from-slate-500 to-slate-500",
      icon: "🎫",
    },
    {
      label: "Pending Tasks",
      value: stats.todo,
      gradient: "from-orange-300 to-red-300",
      icon: "⏳",
    },
    {
      label: "Completed",
      value: stats.done,
      gradient: "from-emerald-300 to-green-300",
      icon: "✅",
    },
  ];

  const completionRate =
    stats.tickets > 0 ? Math.round((stats.done / stats.tickets) * 100) : 0;

  return (
    <div>
      {/* HEADER */}
      <h1 className="text-4xl font-extrabold text-slate-900 mb-10">
        Workspace Dashboard
      </h1>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {cardData.map((stat, i) => (
          <div
            key={i}
            className={`relative p-8 rounded-3xl text-white shadow-xl overflow-hidden
            bg-gradient-to-br ${stat.gradient} 
            hover:scale-[1.03] transition-transform duration-300`}
          >
            <div className="absolute right-6 top-6 text-4xl opacity-20">
              {stat.icon}
            </div>

            <p className="text-xs font-black uppercase tracking-widest opacity-80">
              {stat.label}
            </p>

            <p className="mt-4 text-6xl font-extrabold">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* COMPLETION CARD */}
      <div className="mt-14 bg-white rounded-3xl shadow-xl border border-gray-100 p-10">
        <h2 className="text-2xl font-extrabold text-slate-800 mb-6">
          Project Completion Rate
        </h2>

        <div className="w-full bg-gray-200 rounded-full h-5 mb-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-green-600 transition-all duration-1000 ease-out shadow-[0_0_25px_rgba(16,185,129,0.6)]"
            style={{ width: `${completionRate}%` }}
          />
        </div>

        <div className="flex justify-between items-center">
          <p className="text-gray-600 font-medium">
            {stats.tickets > 0
              ? `${completionRate}% of all assigned tickets are finished`
              : "No tickets recorded in the workspace yet."}
          </p>

          <span className="text-3xl font-extrabold text-emerald-600">
            {completionRate}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
