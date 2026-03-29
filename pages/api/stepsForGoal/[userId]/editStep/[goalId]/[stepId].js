import { connectToDatabase } from "../../../../../../database/mongodb";
import { ObjectId } from "mongodb";

const GOALS_COLLECTION = "goals";

export async function editStepForGoal(req, res) {
  try {
    const { db } = await connectToDatabase();
    const { userId, goalId, stepId } = req.query;
    const { achieved } = req.body; // legacy title might be sent but we only care about achieved for XP

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid input parameters" });
    }

    const user = await db.collection(GOALS_COLLECTION).findOne({ _id: new ObjectId(userId) });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Find the current step state
    const goal = user.goals.find(g => g.IdForGoal === goalId);
    const step = goal?.steps?.find(s => s.stepId === stepId);
    
    let updateQuery = {
      $set: {
        "goals.$[goal].steps.$[step].achieved": achieved,
      },
    };

    // XP Logic: +50 for step completion
    if (achieved && step && !step.achieved) {
      updateQuery.$inc = { xp: 50 };
      
      // Level Up Logic
      if ((user.xp + 50) >= (user.level * 1000)) {
        updateQuery.$inc.level = 1;
      }
    }

    const response = await db.collection(GOALS_COLLECTION).findOneAndUpdate(
      {
        _id: new ObjectId(userId),
        "goals.IdForGoal": goalId,
        "goals.steps.stepId": stepId,
      },
      updateQuery,
      {
        arrayFilters: [{ "goal.IdForGoal": goalId }, { "step.stepId": stepId }],
        returnDocument: "after",
      }
    );
    res.json(response.value);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
