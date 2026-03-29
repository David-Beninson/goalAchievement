import { connectToDatabase } from "../../../database/mongodb";
import { ObjectId } from "mongodb";
import { getSession } from "next-auth/react";

export default async function getStats(req, res) {
  try {
    const session = await getSession({ req });
    if (!session) return res.status(401).json({ error: "Unauthorized" });

    const { db } = await connectToDatabase();
    const user = await db.collection("goals").findOne({ email: session.user.email });

    if (!user) return res.status(404).json({ error: "User not found" });

    const goals = user.goals || [];
    
    const stats = {
      totalGoals: goals.length,
      completedGoals: goals.filter(g => g.achieved).length,
      priorityData: [
        { name: "High", value: goals.filter(g => g.priority === "high").length },
        { name: "Medium", value: goals.filter(g => g.priority === "medium").length },
        { name: "Low", value: goals.filter(g => g.priority === "low").length },
      ],
      completionByGoal: goals.map(g => ({
        name: (g.title || "Goal").substring(0, 10) + "...",
        completed: g.steps?.filter(s => s.achieved).length || 0,
        total: (g.steps?.length || 1) > 0 ? (g.steps?.length || 1) : 1,
      })),
      xp: user.xp || 0,
      level: user.level || 1,
      streak: user.streak || 0
    };

    res.json(stats);
  } catch (error) {
    console.error(`[API ERROR] getStats:`, error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
