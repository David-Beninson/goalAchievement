import { connectToDatabase } from "../../../../../database/mongodb";
import { ObjectId } from "mongodb";

export async function editGoal(req, res) {
  const { db } = await connectToDatabase();
  const { id: mongoUserId, userId: goalId } = req.query; // id is user._id, userId is goal.IdForGoal
  const { title, achieved } = req.body;

  const user = await db.collection("goals").findOne({ _id: new ObjectId(mongoUserId) });
  if (!user) return res.status(404).json({ message: "User not found" });

  let updateQuery = {
    $set: {
      "goals.$.title": title,
      "goals.$.achieved": achieved,
    },
  };

  // Gamification Logic
  if (achieved) {
    const goal = user.goals.find((g) => g.IdForGoal === goalId);
    if (goal && !goal.achieved) {
      // Goal was just marked as achieved
      const now = new Date();
      const last = user.lastCompletedDate ? new Date(user.lastCompletedDate) : null;
      
      let streakUpdate = user.streak || 0;
      if (!last) {
        streakUpdate = 1;
      } else {
        const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) streakUpdate += 1;
        else if (diffDays > 1) streakUpdate = 1;
      }

      updateQuery.$set.lastCompletedDate = now;
      updateQuery.$set.streak = streakUpdate;
      updateQuery.$inc = { xp: 200 };
      
      // Level Up Logic (every 1000 XP)
      if ((user.xp + 200) >= (user.level * 1000)) {
        updateQuery.$inc.level = 1;
      }
    }
  }

  const result = await db.collection("goals").findOneAndUpdate(
    { _id: new ObjectId(mongoUserId), "goals.IdForGoal": goalId },
    updateQuery,
    { returnDocument: "after" }
  );

  res.json(result.value);
}
