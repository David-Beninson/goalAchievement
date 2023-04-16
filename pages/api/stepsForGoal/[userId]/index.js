import { addStepToGoal } from "./[goalId]";
import { deleteGoalStep } from "./deleteStep/[goalId]/[stepId]";
import { editStepForGoal } from "./editStep/[goalId]/[stepId]";

export default async function handler(req, res) {
  if (method === "POST") {
    try {
      await addStepToGoal(body, res); // include goalId parameter in addStepToGoal call
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error adding step to goal" });
    }
  } else if (method === "PUT") {
    try {
      await editStepForGoal(body, res);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error editing step for goal" });
    }
  } else if (method === "DELETE") {
    try {
      await deleteGoalStep(body, res);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error deleting step for goal" });
    }
  } else {
    res.status(400).json({ message: "Invalid request method" });
  }
}
