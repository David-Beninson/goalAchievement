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

  useEffect(() => {
    fetch("/api/stats")
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  const COLORS = ["#8B5CF6", "#3B82F6", "#10B981"];

  if (loading) return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="space-y-12 pb-24">
        <header>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
             <BarChart2 className="text-primary" size={36} />
             Nexus Analytics
          </h1>
          <p className="text-muted-foreground mt-2 tracking-wide font-medium italic">Deep-dive into your forge performance.</p>
        </header>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 text-center bg-gradient-to-br from-primary/10 to-transparent">
             <Zap className="mx-auto mb-4 text-primary" size={32} />
             <p className="text-3xl font-black">{stats.xp}</p>
             <p className="text-xs uppercase font-black tracking-widest text-muted-foreground">Total XP Harvested</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-8 text-center bg-gradient-to-br from-orange-500/10 to-transparent">
             <Flame className="mx-auto mb-4 text-orange-400" size={32} />
             <p className="text-3xl font-black">{stats.streak} Days</p>
             <p className="text-xs uppercase font-black tracking-widest text-muted-foreground">Current Momentum</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-8 text-center bg-gradient-to-br from-emerald-500/10 to-transparent">
             <Award className="mx-auto mb-4 text-emerald-400" size={32} />
             <p className="text-3xl font-black">Level {stats.level}</p>
             <p className="text-xs uppercase font-black tracking-widest text-muted-foreground">Forge Rank</p>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8 space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <TrendingUp size={20} className="text-primary" /> Goal Completion Rate
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.completionByGoal}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#0a0a0c", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }} 
                      itemStyle={{ color: "#fff" }}
                    />
                    <Bar dataKey="completed" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </motion.div>

           <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8 space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <PieIcon size={20} className="text-primary" /> Priority Allocation
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.priorityData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats.priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                       contentStyle={{ backgroundColor: "#0a0a0c", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }} 
                       itemStyle={{ color: "#fff" }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: "20px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
           </motion.div>
        </div>
      </div>
    </Layout>
  );
}
