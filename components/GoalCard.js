import React from "react";
import { motion } from "framer-motion";
import { 
  Trash2, 
  CheckCircle2, 
  Clock, 
  MessageSquare
} from "lucide-react";
import ProgressRing from "./ProgressRing";

export default function GoalCard({ goal, onSelect, onDelete, onToggle }) {
  const completedSteps = goal.steps?.filter(s => s.achieved).length || 0;
  const totalSteps = goal.steps?.length || 0;
  const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : (goal.achieved ? 100 : 0);

  const priorityStyles = {
    high: "text-red-700 bg-red-50 border-red-200 shadow-red-100",
    medium: "text-orange-700 bg-orange-50 border-orange-200 shadow-orange-100",
    low: "text-blue-700 bg-blue-50 border-blue-200 shadow-blue-100"
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
      className={`glass-card p-8 flex flex-col gap-6 cursor-pointer group relative overflow-hidden bg-white border-2 border-slate-100 hover:border-primary/30 transition-all ${
        goal.achieved ? "opacity-90 grayscale-[0.5]" : ""
      }`}
      onClick={() => onSelect(goal)}
    >
      <div className="flex justify-between items-start relative z-10">
        <div className="flex items-center gap-5">
          <ProgressRing percentage={progress} size={64} strokeWidth={6} />
          <div className="flex flex-col gap-2">
             <span className={`w-fit px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border shadow-sm ${priorityStyles[goal.priority || 'medium']}`}>
              {goal.priority || 'medium'}
            </span>
            <h3 className={`font-black text-xl leading-tight text-slate-900 group-hover:text-primary transition-colors tracking-tight ${goal.achieved ? "line-through text-slate-400 italic" : ""}`}>
              {goal.title}
            </h3>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
           <button 
            onClick={(e) => { e.stopPropagation(); onToggle(goal.IdForGoal, goal.title, !goal.achieved); }}
            className={`p-3 rounded-xl border-2 border-white shadow-md transition-all active:scale-95 ${goal.achieved ? "bg-emerald-500 text-white" : "bg-white text-slate-400 hover:text-emerald-600 hover:border-emerald-100"}`}
          >
            <CheckCircle2 size={20} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(goal._id); }}
            className="p-3 bg-white text-slate-400 border-2 border-white shadow-md hover:text-red-600 hover:border-red-100 rounded-xl transition-all active:scale-95"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <p className="text-slate-500 font-medium line-clamp-2 min-h-[3rem] leading-relaxed relative z-10 italic">
        {goal.description || "Forging forward without a description..."}
      </p>

      <div className="flex items-center justify-between mt-auto pt-6 border-t-2 border-slate-50 relative z-10">
        <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
              <MessageSquare size={14} />
            </div>
            <span>{totalSteps} Steps</span>
          </div>
          {goal.deadline && (
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-orange-100 rounded-lg text-orange-600">
                <Clock size={14} />
              </div>
              <span>{new Date(goal.deadline).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        
        <div className="flex -space-x-2">
           <div className="w-8 h-8 rounded-xl border-2 border-white bg-slate-100 flex items-center justify-center text-[11px] font-black text-slate-400 shadow-sm">
             GP
           </div>
        </div>
      </div>

      {/* Subtle bottom accent */}
      <div className={`absolute bottom-0 left-0 h-1 transition-all group-hover:w-full ${
        goal.priority === 'high' ? 'bg-red-500 w-12' : 
        goal.priority === 'medium' ? 'bg-orange-500 w-12' : 
        'bg-blue-500 w-12'
      }`} />
    </motion.div>
  );
}
