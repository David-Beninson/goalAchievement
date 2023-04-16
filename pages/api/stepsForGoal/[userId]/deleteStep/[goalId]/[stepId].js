import { connectToDatabase } from "../../../../../../database/mongodb";
import { ObjectId } from "mongodb";

export default async function deleteGoalStep(req, res) {
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
    { returnOriginal: false }
  );
  const user = response.value;
  if (!user) {
    // handle the case when the user document is not found
    res.status(404).json({ message: "User not found" });
    return;
  }

  const goals = user.goals || [];
  const goal = goals.find((g) => g.IdForGoal === goalId);
  const steps = goal?.steps || [];
  res.json(steps);
}
