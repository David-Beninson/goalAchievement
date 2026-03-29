import Head from "next/head";
import React, { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import Layout from "../layout/layout";
import { 
  Target, 
  Flame, 
  Award, 
  CheckCircle2, 
  TrendingUp, 
  ChevronRight,
  Plus,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import ProgressRing from "../components/ProgressRing";
import { useRouter } from "next/router";

const MOTIVATIONS = [
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "Your only limit is your mind.",
  "Small steps every day lead to big results.",
  "Don't stop when you're tired. Stop when you're done.",
  "Focus on being productive instead of busy."
];

export default function Home({ user }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [motivation, setMotivation] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    achieved: 0,
    xp: 0,
    streak: 0,
    level: 1
  });

  useEffect(() => {
    setMotivation(MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)]);
    if (user) {
      setStats({
        total: user.goals?.length || 0,
        achieved: user.goals?.filter(g => g.achieved).length || 0,
        xp: user.xp || 0,
        streak: user.streak || 0,
        level: user.level || 1
      });
    }
  }, [user]);

  if (!session) return null;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Layout>
      <Head>
        <title>Dashboard | GoalPro</title>
      </Head>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8 text-slate-900"
      >
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
             <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs">
               <Sparkles size={14} /> Global Achievement Nexus
             </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
              Welcome back, {user.username}!
            </h1>
            <p className="text-slate-500 font-medium italic opacity-80">
              "{motivation}"
            </p>
          </div>
          <button 
            onClick={() => router.push("/GoalMarket")}
            className="flex items-center gap-3 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-black shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 text-lg"
          >
            <Plus size={24} />
            NEW GOAL
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Active Goals", value: stats.total, icon: Target, color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
            { label: "Completed", value: stats.achieved, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
            { label: "Current Level", value: stats.level, icon: Award, color: "text-purple-600", bg: "bg-purple-50 border-purple-100" },
            { label: "Daily Streak", value: `${stats.streak} Days`, icon: Flame, color: "text-orange-600", bg: "bg-orange-50 border-orange-100" },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className={`glass-card p-6 flex items-center justify-between group border-2 ${item.bg}`}
            >
              <div>
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{item.label}</p>
                <p className="text-3xl font-black mt-1 tracking-tight text-slate-900">{item.value}</p>
              </div>
              <div className={`p-4 rounded-2xl ${item.color} bg-white shadow-sm border border-slate-100`}>
                <item.icon size={28} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-black flex items-center gap-3">
                <TrendingUp size={24} className="text-primary" />
                Forge Progress
              </h2>
              <button 
                onClick={() => router.push("/GoalMarket")}
                className="text-primary text-sm font-black hover:underline flex items-center gap-1 uppercase tracking-widest"
              >
                View All <ChevronRight size={14} />
              </button>
            </div>

            <div className="space-y-4">
              {user.goals?.length === 0 ? (
                <div className="glass-card p-16 text-center flex flex-col items-center gap-4 bg-white border-dashed border-2 border-slate-200">
                  <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                    <Target size={40} />
                  </div>
                  <h3 className="text-xl font-bold">No goals forge yet.</h3>
                  <p className="text-slate-500 font-medium">Start your journey today by adding your first big objective.</p>
                </div>
              ) : (
                user.goals.slice(0, 4).map((goal) => {
                  const completedSteps = goal.steps?.filter(s => s.achieved).length || 0;
                  const totalSteps = goal.steps?.length || 1;
                  const progress = Math.round((completedSteps / totalSteps) * 100);
                  
                  return (
                    <motion.div
                      key={goal.IdForGoal}
                      whileHover={{ scale: 1.01 }}
                      className="glass-card p-6 flex items-center justify-between group cursor-pointer border-2 border-transparent hover:border-primary/20 bg-white"
                      onClick={() => router.push("/GoalMarket")}
                    >
                      <div className="flex items-center gap-6 overflow-hidden">
                        <ProgressRing percentage={goal.achieved ? 100 : progress} size={64} strokeWidth={6} />
                        <div className="overflow-hidden space-y-1">
                          <h3 className="text-lg font-black truncate text-slate-900 tracking-tight">{goal.title}</h3>
                          <p className="text-sm font-bold text-slate-500 truncate opacity-70">{goal.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className={`hidden sm:block px-4 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-widest border-2 ${
                          goal.priority === 'high' ? 'bg-red-50 text-red-600 border-red-100' :
                          goal.priority === 'medium' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                          'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>
                          {goal.priority || 'medium'}
                        </span>
                        <ChevronRight size={24} className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </motion.div>
                  )
                })
              )}
            </div>
          </motion.div>

          {/* Level Section (Light Mode) */}
          <motion.div variants={itemVariants} className="space-y-6">
             <h2 className="text-2xl font-black flex items-center gap-3 px-2">
                <Award size={24} className="text-primary" />
                Evolution
              </h2>
              <div className="glass-card p-8 space-y-8 bg-white border-2 border-slate-100 overflow-hidden relative">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
                
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <div className="w-28 h-28 rounded-3xl bg-primary/10 flex items-center justify-center border-4 border-white shadow-xl relative z-10 rotate-3 transition-transform hover:rotate-0">
                      <span className="text-5xl font-black text-primary">{stats.level}</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-black text-2xl tracking-tight text-slate-900 uppercase">Rank: Tier {stats.level}</p>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stats.xp} Total XP</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-500">
                    <span>TO LEVEL {stats.level + 1}</span>
                    <span className="text-primary">{stats.xp % 1000} / 1000</span>
                  </div>
                  <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden border-2 border-white shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(stats.xp % 1000) / 10}%` }}
                      className="h-full bg-gradient-to-r from-primary to-purple-500 shadow-lg shadow-primary/20"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                   <div className="space-y-1">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Next Goal Rewards</p>
                      <p className="text-sm font-black text-slate-700">+200 XP ON FINISH</p>
                   </div>
                   <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100">
                     <Award size={20} />
                   </div>
                </div>
              </div>
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
}

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  const email = session?.user?.email;

  if (!session) {
    return {
      redirect: {
        destination: "/Login",
        permanent: false,
      },
    };
  }

  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/getDataOnUser?email=${email}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) throw new Error("Network response was not ok");

    const res = await response.json();
    const user = res.user;

    return {
      props: { user },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: { error: "Error fetching data" },
    };
  }
};
