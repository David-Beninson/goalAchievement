import { connectToDatabase } from "../../../database/mongodb";

async function findUser(req, res) {
  const { db } = await connectToDatabase();
  try {
    if (req.method === "GET") {
      const collection = db.collection("goals");
      const user = await collection.findOne({
        email: req.query.email,
        password: req.query.password,
      });

      if (!user) {
        res.status(404).json({ error: "User not found" });
      } else {
        res.status(200).json({ user });
      }
    }
  } catch (error) {
    console.error("Error connecting to database:", error);
    res.status(500).json({ error: "Error connecting to database" });
  }
}

export default findUser;
