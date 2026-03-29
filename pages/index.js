import Head from "next/head";
import React, { useEffect, useState } from "react";
import { getSession, useSession, signOut } from "next-auth/react";
import Layout from "../layout/layout";
import { 
  Target, 
  Flame, 
  Award, 
  CheckCircle2, 
  TrendingUp, 
  Clock,
  ChevronRight,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

  if (!session) return null; // Handled by getServerSideProps redirect

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1
      }
    }
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
        className="space-y-8"
      >
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Welcome back, {user.username}!
            </h1>
            <p className="text-muted-foreground mt-2 italic">
              "{motivation}"
            </p>
          </div>
          <button 
            onClick={() => router.push("/GoalMarket")}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
          >
            <Plus size={20} />
            Add New Goal
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Active Goals", value: stats.total, icon: Target, color: "text-blue-400", bg: "bg-blue-400/10" },
            { label: "Completed", value: stats.achieved, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10" },
            { label: "Current Level", value: stats.level, icon: Award, color: "text-purple-400", bg: "bg-purple-400/10" },
            { label: "Daily Streak", value: `${stats.streak} Days`, icon: Flame, color: "text-orange-400", bg: "bg-orange-400/10" },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="glass-card p-6 flex items-center justify-between group hover:border-primary/30"
            >
              <div>
                <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                <p className="text-2xl font-bold mt-1 tracking-tight">{item.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${item.bg} ${item.color}`}>
                <item.icon size={24} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <TrendingUp size={20} className="text-primary" />
                Recent Progress
              </h2>
              <button 
                onClick={() => router.push("/GoalMarket")}
                className="text-primary text-sm font-semibold hover:underline flex items-center gap-1"
              >
                View All <ChevronRight size={14} />
              </button>
            </div>

            <div className="space-y-4">
              {user.goals?.length === 0 ? (
                <div className="glass-card p-12 text-center flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground">
                    <Target size={32} />
                  </div>
                  <p className="text-muted-foreground">No goals yet. Start your journey today!</p>
                </div>
              ) : (
                user.goals.slice(0, 3).map((goal, idx) => {
                  const completedSteps = goal.steps?.filter(s => s.achieved).length || 0;
                  const totalSteps = goal.steps?.length || 1;
                  const progress = Math.round((completedSteps / totalSteps) * 100);
                  
                  return (
                    <motion.div
                      key={goal.IdForGoal}
                      className="glass-card p-4 flex items-center justify-between group cursor-pointer hover:bg-white/5"
                    >
                      <div className="flex items-center gap-4 overflow-hidden">
                        <ProgressRing percentage={goal.achieved ? 100 : progress} size={48} strokeWidth={4} />
                        <div className="overflow-hidden">
                          <h3 className="font-bold truncate">{goal.title}</h3>
                          <p className="text-xs text-muted-foreground truncate">{goal.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          goal.priority === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                          goal.priority === 'medium' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                          'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}>
                          {goal.priority || 'medium'}
                        </span>
                        <ChevronRight size={20} className="text-muted-foreground group-hover:text-white group-hover:translate-x-1" />
                      </div>
                    </motion.div>
                  )
                })
              )}
            </div>
          </motion.div>

          {/* XP & Level Section */}
          <motion.div variants={itemVariants} className="space-y-6">
             <h2 className="text-xl font-bold flex items-center gap-2 px-2">
                <Award size={20} className="text-primary" />
                Evolution
              </h2>
              <div className="glass-card p-6 space-y-6 bg-gradient-to-br from-primary/10 to-transparent">
                <div className="text-center space-y-2">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center border-4 border-primary/30 relative z-10">
                      <span className="text-4xl font-black text-white">{stats.level}</span>
                    </div>
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute inset-0 bg-primary rounded-full filter blur-xl opacity-20" 
                    />
                  </div>
                  <p className="font-bold text-lg tracking-wide uppercase">Level {stats.level}</p>
                  <p className="text-sm text-muted-foreground">{stats.xp} Total XP</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <span>Progress to Level {stats.level + 1}</span>
                    <span>{stats.xp % 1000}/1000</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(stats.xp % 1000) / 10}%` }}
                      className="h-full bg-gradient-to-r from-primary to-purple-500 shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-3">
                   <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Goals to next level</span>
                      <span className="font-bold text-white">~{Math.ceil((1000 - (stats.xp % 1000)) / 200)}</span>
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
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const res = await response.json();
    const user = res.user;

    return {
      props: {
        user,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        error: "Error fetching data",
      },
    };
  }
};
