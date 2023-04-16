import { connectToDatabase } from "../../../database/mongodb";

async function addUser(req, res) {
  const { db } = await connectToDatabase();
  try {
    if (req.method === "POST") {
      const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: "User",
        goals: [],
      };
      await db.collection("goals").insertOne(newUser);
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error("Error connecting to database:", error);
    res.status(500).json({ error: "Error connecting to database" });
  }
}

export default addUser;
