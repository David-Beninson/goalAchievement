import { addStepToGoal } from "./[goalId]";
import { deleteGoalStep } from "./deleteStep/[goalId]/[stepId]";
import { editStepForGoal } from "./editStep/[goalId]/[stepId]";

export default async function handler(req, res) {
  const { method, body } = req;
  
  try {
    if (method === "POST") {
      await addStepToGoal(req, res);
    } else if (method === "PUT") {
      await editStepForGoal(req, res);
    } else if (method === "DELETE") {
      await deleteGoalStep(req, res);
    } else {
      res.status(400).json({ message: "Invalid request method" });
    }
  } catch (error) {
    console.error(`[API ERROR] stepsForGoal/index:`, error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
