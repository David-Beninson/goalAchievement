import React, { useEffect, useState } from "react";
import Layout from "../layout/layout";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { 
  BarChart2, 
  PieChart as PieIcon, 
  TrendingUp, 
  Award,
  Flame,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

export default function Statistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/stats")
      .then(res => {
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        return res.json();
      })
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Stats fetch error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const COLORS = ["#8B5CF6", "#3B82F6", "#10B981"];

  if (loading) return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Analyzing Forge Data...</p>
        </div>
      </div>
    </Layout>
  );

  if (error || !stats) return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="glass-card p-12 max-w-md w-full text-center space-y-6 bg-white border-2 border-red-100">
           <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white shadow-xl">
              <Zap size={40} />
           </div>
           <h2 className="text-2xl font-black text-slate-900">Sync Interrupted</h2>
           <p className="text-slate-500 font-medium leading-relaxed">
             We couldn't retrieve your analytics. This is usually due to a temporary connection spike or missing forge credentials.
           </p>
           <button 
             onClick={() => window.location.reload()}
             className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest"
           >
             Retry Synchronization
           </button>
        </div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="space-y-12 pb-24 text-slate-900">
        <header>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
             <BarChart2 className="text-primary" size={36} />
             Nexus Analytics
          </h1>
          <p className="text-slate-500 mt-2 tracking-wide font-medium italic opacity-80">Deep-dive into your forge performance.</p>
        </header>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 text-center bg-white border-2 border-slate-100 shadow-xl shadow-slate-200/50">
             <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary border-2 border-white shadow-lg">
                <Zap size={28} />
             </div>
             <p className="text-4xl font-black tracking-tight text-slate-900">{stats.xp}</p>
             <p className="text-xs uppercase font-black tracking-widest text-slate-400 mt-1">Total XP Harvested</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-8 text-center bg-white border-2 border-slate-100 shadow-xl shadow-slate-200/50">
             <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-4 text-orange-500 border-2 border-white shadow-lg">
                <Flame size={28} />
             </div>
             <p className="text-4xl font-black tracking-tight text-slate-900">{stats.streak} Days</p>
             <p className="text-xs uppercase font-black tracking-widest text-slate-400 mt-1">Current Momentum</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-8 text-center bg-white border-2 border-slate-100 shadow-xl shadow-slate-200/50">
             <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4 text-emerald-500 border-2 border-white shadow-lg">
                <Award size={28} />
             </div>
             <p className="text-4xl font-black tracking-tight text-slate-900">Level {stats.level}</p>
             <p className="text-xs uppercase font-black tracking-widest text-slate-400 mt-1">Forge Rank</p>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8 space-y-6 bg-white border-2 border-slate-100">
              <h3 className="text-2xl font-black flex items-center gap-3 tracking-tight">
                <div className="p-2 bg-primary/10 rounded-xl text-primary border-2 border-white shadow-sm">
                    <TrendingUp size={20} />
                </div>
                Goal Completion Rate
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.completionByGoal}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ backgroundColor: "#ffffff", border: "2px solid #f1f5f9", borderRadius: "16px", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }} 
                      itemStyle={{ color: "#0f172a", fontWeight: "bold" }}
                      labelStyle={{ color: "#64748b", textTransform: "uppercase", fontSize: "10px", fontWeight: "900", letterSpacing: "0.1em", marginBottom: "4px" }}
                    />
                    <Bar dataKey="completed" fill="#8B5CF6" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </motion.div>

           <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8 space-y-6 bg-white border-2 border-slate-100">
              <h3 className="text-2xl font-black flex items-center gap-3 tracking-tight">
                <div className="p-2 bg-primary/10 rounded-xl text-primary border-2 border-white shadow-sm">
                    <PieIcon size={20} />
                </div>
                Priority Allocation
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.priorityData}
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {stats.priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                       contentStyle={{ backgroundColor: "#ffffff", border: "2px solid #f1f5f9", borderRadius: "16px", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }} 
                       itemStyle={{ color: "#0f172a", fontWeight: "bold" }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: "30px", fontWeight: "bold", fontSize: "12px", color: "#64748b" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
           </motion.div>
        </div>
      </div>
    </Layout>
  );
}
