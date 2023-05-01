import { connectToDatabase } from "../../../../database/mongodb";
import { ObjectId } from "mongodb";

export async function deleteGoal(req, res) {
  const { db } = await connectToDatabase();
  const { userId, id } = req.query;
  const result = await db
    .collection("goals")
    .findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $pull: { goals: { IdForGoal: id } } },
      { returnOriginal: false }
    );
  const user = result.value;
  if (!user) {
    // handle the case when the user document is not found
    res.status(404).json({ message: "User not found" });
    return;
  }

  const goals = user.goals || [];
  res.json(goals);
}

export async function addGoal(req, res) {
  const { db } = await connectToDatabase();
  const { IdForGoal, title, achieved, description } = req.body;
  const { userId } = req.query;
  const newGoal = {
    IdForGoal,
    title,
    achieved,
    description,
    steps: [],
  };

  const result = await db
    .collection("goals")
    .findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $push: { goals: newGoal } },
      { returnOriginal: false }
    );

  const user = result.value;

  if (!user) {
    // handle the case when the user document is not found
    res.status(404).json({ message: "User not found" });
    return;
  }
  const goals = user.goals || [];
  res.json(goals);
}
