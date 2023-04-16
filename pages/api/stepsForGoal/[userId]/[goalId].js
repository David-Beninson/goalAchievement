import { connectToDatabase } from "../../../../database/mongodb";
import { ObjectId } from "mongodb";

export default async function addStepToGoal(req, res) {
  const { db } = await connectToDatabase();

  if (!req.query.goalId || !req.query.userId) {
    res.status(400).json({ message: "Missing id parameter" });
    return;
  }

  const userId = req.query.userId;
  const goalId = req.query.goalId;
  const { title, achieved, stepId } = req.body;

  const newStep = {
    title,
    achieved,
    stepId,
  };

  try {
    const response = await db.collection("goals").updateOne(
      {
        _id: new ObjectId(userId),
        "goals.IdForGoal": goalId,
      },
      {
        $push: { "goals.$.steps": newStep },
      }
    );
    if (response.modifiedCount === 1) {
      res.status(200).json({ message: "Step added successfully" });
    } else {
      res.status(500).json({ message: "Failed to add step to goal" });
    }
  } catch (err) {
    console.error(`Failed to add step to goal ${goalId}: ${err}`);
    res.status(500).json({ message: "Failed to add step to goal" });
  }
}
