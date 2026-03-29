import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  ChevronLeft, 
  CheckCircle2, 
  Zap,
  Target,
  X
} from "lucide-react";
import GoalCard from "./GoalCard";
import AddGoalModal from "./AddGoalModal";
import confetti from "canvas-confetti";

export default function GoalMarketComponent({ goals, setGoals, usersId, email }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredGoals = goals.filter((g) => {
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = 
      filter === "all" ? true :
      filter === "active" ? !g.achieved :
      filter === "completed" ? g.achieved : true;
    return matchesSearch && matchesFilter;
  });

  const handleAddGoal = async (data) => {
    const IdForGoal = Math.random().toString(36).substr(2, 9);
    const newGoal = {
      ...data,
      IdForGoal,
      achieved: false,
      steps: [],
      usersId
    };

    setGoals(prev => [...prev, { ...newGoal, _id: "temp-" + Date.now() }]);

    try {
      const response = await fetch(`/api/mainGoal/${usersId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGoal),
      });
      const savedGoal = await response.json();
      setGoals(prev => prev.map(g => g.IdForGoal === IdForGoal ? savedGoal : g));
    } catch (err) {
      setGoals(prev => prev.filter(g => g.IdForGoal !== IdForGoal));
    }
  };

  const handleDeleteGoal = async (id) => {
    const previousGoals = [...goals];
    setGoals(prev => prev.filter(g => g._id !== id));

    try {
      await fetch(`/api/mainGoal/${usersId}/?id=${id}`, { method: "DELETE" });
    } catch (err) {
      setGoals(previousGoals);
    }
  };

  const handleToggleGoal = async (id, title, achieved) => {
    const previousGoals = [...goals];
    setGoals(prev => prev.map(g => g.IdForGoal === id ? { ...g, achieved } : g));

    if (achieved) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#8B5CF6", "#D946EF", "#3B82F6"]
      });
    }

    try {
      await fetch(`/api/mainGoal/${id}/edit/${usersId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title, achieved }),
      });
    } catch (err) {
      setGoals(previousGoals);
    }
  };

  const handleToggleStep = async (goalId, stepId, achieved) => {
    setGoals(prev => prev.map(goal => {
      if (goal.IdForGoal === goalId) {
        const updatedSteps = goal.steps.map(s => s.stepId === stepId ? { ...s, achieved } : s);
        return { ...goal, steps: updatedSteps };
      }
      return goal;
    }));

    try {
      await fetch(`/api/stepsForGoal/${usersId}/editStep/${goalId}/${stepId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ achieved }),
      });
    } catch (err) {}
  };

  const handleAddStep = async (goalId, title) => {
    const stepId = Math.random().toString(36).substr(2, 9);
    const newStep = { stepId, title, achieved: false };

    setGoals(prev => prev.map(goal => {
      if (goal.IdForGoal === goalId) {
        return { ...goal, steps: [...(goal.steps || []), newStep] };
      }
      return goal;
    }));

    await fetch(`/api/stepsForGoal/${usersId}/${goalId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStep),
    });
  };

  return (
    <div className="space-y-8 min-h-screen pb-24 text-slate-900">
      {/* Header & Controls */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            <Target className="text-primary" size={36} />
            My Goal Forge
          </h1>
          <p className="text-slate-500 font-medium italic opacity-80 mt-1">Sculpt your vision into reality.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-64 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Sift goals..."
              className="w-full bg-white border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium"
            />
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border-2 border-white shadow-sm w-full sm:w-auto">
             {["all", "active", "completed"].map(f => (
               <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    filter === f ? "bg-white text-primary shadow-md" : "text-slate-500 hover:text-slate-900"
                  }`}
               >
                 {f}
               </button>
             ))}
          </div>
        </div>
      </header>

      {/* Goal Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredGoals.map((goal) => (
            <GoalCard 
              key={goal.IdForGoal} 
              goal={goal} 
              onSelect={setSelectedGoal}
              onDelete={handleDeleteGoal}
              onToggle={handleToggleGoal}
              onEdit={() => {}} 
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredGoals.length === 0 && (
        <div className="glass-card p-20 text-center flex flex-col items-center gap-6 border-dashed border-slate-300 bg-white shadow-inner">
          <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center border-4 border-white shadow-xl">
            <Zap size={44} className="text-slate-300" />
          </div>
          <div className="max-w-xs space-y-2">
            <h3 className="text-2xl font-black">No Goals Found</h3>
            <p className="text-slate-500 font-medium italic opacity-80">The forge is silent. Ignite your journey with a new objective.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-2xl font-black shadow-2xl shadow-primary/30 transition-all hover:scale-105"
          >
            FORGE NEW GOAL
          </button>
        </div>
      )}

      {/* Steps Sidebar / High Contrast Light Overlay */}
      <AnimatePresence>
        {selectedGoal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedGoal(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="bg-white border-l-4 border-primary rounded-l-[40px] shadow-2xl w-full max-w-md h-[95vh] my-auto mr-4 relative z-10 flex flex-col p-10 gap-10"
            >
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border-2 border-white shadow-lg">
                        <Target size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black truncate max-w-[200px] tracking-tight">{selectedGoal.title}</h2>
                        <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">Sub-Goal Matrix</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedGoal(null)} className="p-3 bg-slate-50 hover:bg-red-50 hover:text-red-600 rounded-full transition-all border-2 border-white shadow-lg">
                    <X size={20} />
                  </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                 {(selectedGoal.steps || []).map((step) => (
                   <div key={step.stepId} className="group p-5 bg-slate-50 border-2 border-white rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-between">
                     <div className="flex items-center gap-5">
                       <button 
                        onClick={() => handleToggleStep(selectedGoal.IdForGoal, step.stepId, !step.achieved)}
                        className={`w-8 h-8 rounded-xl border-2 transition-all flex items-center justify-center ${
                          step.achieved ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-white border-slate-200 text-transparent hover:border-primary group-hover:bg-slate-50"
                        }`}
                       >
                         <CheckCircle2 size={18} />
                       </button>
                       <span className={`text-lg font-bold tracking-tight ${step.achieved ? "line-through text-slate-400 italic" : "text-slate-800"}`}>
                        {step.title}
                       </span>
                     </div>
                   </div>
                 ))}
                 
                 <div className="relative group pt-4">
                    <Plus className="absolute left-4 top-1/2 translate-y-[-5%] text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                    <input 
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && e.target.value) {
                            handleAddStep(selectedGoal.IdForGoal, e.target.value);
                            e.target.value = "";
                          }
                        }}
                        placeholder="Add a new milestone..."
                        className="w-full bg-slate-100 border-2 border-white rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-primary focus:bg-white shadow-inner transition-all font-bold placeholder:italic placeholder:font-medium"
                    />
                 </div>
              </div>

              <div className="pt-8 border-t-2 border-slate-50">
                 <button 
                  onClick={() => handleToggleGoal(selectedGoal.IdForGoal, selectedGoal.title, !selectedGoal.achieved)}
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-lg transition-all active:scale-[0.98] ${
                    selectedGoal.achieved ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-primary text-white shadow-2xl shadow-primary/30 hover:scale-[1.02]"
                  }`}
                 >
                   {selectedGoal.achieved ? "Goal Ascended" : "Complete Mastery"}
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-10 right-10 w-20 h-20 bg-primary text-white rounded-[2.5rem] shadow-2xl shadow-primary/40 flex items-center justify-center z-50 border-4 border-white transition-all overflow-hidden"
      >
        <Plus size={40} className="relative z-10" />
      </motion.button>

      <AddGoalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddGoal} 
      />
    </div>
  );
}
