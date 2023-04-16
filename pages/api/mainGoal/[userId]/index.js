import { addGoal, deleteGoal } from "./[id]";
import { editGoal } from "./edit/[id]";

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Call the addGoal function to add a new document to the collection
    await addGoal(req, res);
  } else if (req.method === "PUT") {
    // Call the editGoal function to update a document in the collection
    await editGoal(req, res);
  } else if (req.method === "DELETE") {
    // Call the deleteGoal function to remove a document from the collection
    await deleteGoal(req, res);
  } else {
    res.status(400).json({ message: "Invalid request method" });
  }
}
