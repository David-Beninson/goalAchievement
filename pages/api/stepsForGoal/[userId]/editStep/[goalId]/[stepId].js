import { connectToDatabase } from "../../../../../../database/mongodb";
import { ObjectId } from "mongodb";

const GOALS_COLLECTION = "goals";

export default async function updateGoalStep(req, res) {
  try {
    const { db } = await connectToDatabase();
    const { userId, goalId, stepId } = req.query;
    const { title, achieved } = req.body;
    // Validate input parameters
    if (
      !ObjectId.isValid(userId) ||
      !ObjectId.isValid(goalId) ||
      !ObjectId.isValid(stepId)
    ) {
      return res.status(400).json({ error: "Invalid input parameters" });
    }

    if (typeof achieved !== "boolean") {
      return res.status(400).json({ error: "Invalid achieved value" });
    }

    const response = await db.collection(GOALS_COLLECTION).findOneAndUpdate(
      {
        _id: new ObjectId(userId),
        "goals.IdForGoal": goalId,
        "goals.steps.stepId": stepId,
      },
      {
        $set: {
          "goals.$[goal].steps.$[step].title": title,
          "goals.$[goal].steps.$[step].achieved": achieved,
        },
      },
      {
        arrayFilters: [{ "goal.IdForGoal": goalId }, { "step.stepId": stepId }],
        returnOriginal: false,
      }
    );
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
