import { connectToDatabase } from "../../../../../../database/mongodb";
import { ObjectId } from "mongodb";

export async function deleteGoalStep(req, res) {
  try {
    const { db } = await connectToDatabase();
    const { userId, goalId, stepId } = req.query;

    const response = await db.collection("goals").findOneAndUpdate(
      {
        _id: new ObjectId(userId),
        "goals.IdForGoal": goalId,
      },
      {
        $pull: { "goals.$.steps": { stepId: stepId } },
      },
      { returnDocument: "after" }
    );
    const user = response.value;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const goals = user.goals || [];
    const goal = goals.find((g) => g.IdForGoal === goalId);
    const steps = goal?.steps || [];
    res.json(steps);
  } catch (error) {
    console.error(`[API ERROR] deleteGoalStep:`, error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
