import { addGoal, deleteGoal } from "./[id]";
import { editGoal } from "./edit/[id]";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      await addGoal(req, res);
    } else if (req.method === "PUT") {
      await editGoal(req, res);
    } else if (req.method === "DELETE") {
      await deleteGoal(req, res);
    } else {
      res.status(400).json({ message: "Invalid request method" });
    }
  } catch (error) {
    console.error(`[API ERROR] mainGoal/index:`, error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
