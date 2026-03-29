import React from "react";
import { motion } from "framer-motion";
import { 
  MoreVertical, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MessageSquare
} from "lucide-react";
import ProgressRing from "./ProgressRing";

export default function GoalCard({ goal, onSelect, onDelete, onToggle, onEdit }) {
  const completedSteps = goal.steps?.filter(s => s.achieved).length || 0;
  const totalSteps = goal.steps?.length || 0;
  const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : (goal.achieved ? 100 : 0);

  const priorityColors = {
    high: "text-red-400 bg-red-400/10 border-red-500/20",
    medium: "text-orange-400 bg-orange-400/10 border-orange-500/20",
    low: "text-blue-400 bg-blue-400/10 border-blue-500/20"
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className={`glass-card p-6 flex flex-col gap-6 cursor-pointer group relative overflow-hidden ${
        goal.achieved ? "opacity-75" : ""
      }`}
      onClick={() => onSelect(goal)}
    >
      {/* Background Glow */}
      <div className={`absolute -right-12 -top-12 w-32 h-32 blur-3xl opacity-10 rounded-full transition-colors ${
        goal.priority === 'high' ? 'bg-red-500' : 'bg-primary'
      }`} />

      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <ProgressRing percentage={progress} size={56} strokeWidth={5} />
          <div className="flex flex-col gap-1">
             <span className={`w-fit px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${priorityColors[goal.priority || 'medium']}`}>
              {goal.priority || 'medium'}
            </span>
            <h3 className={`font-bold text-lg leading-tight group-hover:text-primary transition-colors ${goal.achieved ? "line-through text-muted-foreground" : ""}`}>
              {goal.title}
            </h3>
          </div>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
           <button 
            onClick={(e) => { e.stopPropagation(); onToggle(goal.IdForGoal, goal.title, !goal.achieved); }}
            className={`p-2 rounded-lg hover:bg-white/10 ${goal.achieved ? "text-emerald-400" : "text-slate-400 hover:text-emerald-400"}`}
          >
            <CheckCircle2 size={18} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(goal._id); }}
            className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
        {goal.description || "No description provided."}
      </p>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MessageSquare size={14} className="text-primary" />
            <span>{totalSteps} Steps</span>
          </div>
          {goal.deadline && (
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-orange-400" />
              <span>{new Date(goal.deadline).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        
        <div className="flex -space-x-2">
           {/* Placeholder for future multi-user support or just a decorative avatar */}
           <div className="w-6 h-6 rounded-full border-2 border-[#0a0a0c] bg-primary/20 flex items-center justify-center text-[10px] font-bold">
             GP
           </div>
        </div>
      </div>
    </motion.div>
  );
}
