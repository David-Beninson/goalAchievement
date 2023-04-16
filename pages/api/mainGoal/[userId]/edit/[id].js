import { connectToDatabase } from "../../../../../database/mongodb";
import { ObjectId } from "mongodb";

export default async function editGoal(req, res) {
  const { db } = await connectToDatabase();
  const { id, userId } = req.query;
  const { title, achieved } = req.body;
  const result = await db
    .collection("goals")
    .findOneAndUpdate(
      { _id: new ObjectId(id), "goals.IdForGoal": userId },
      { $set: { "goals.$.title": title, "goals.$.achieved": achieved } },
      { returnOriginal: false }
    );
  const user = result.value;
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
}
