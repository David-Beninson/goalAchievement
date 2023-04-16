import { connectToDatabase } from "../../database/mongodb";

export default async (req, res) => {
  const { db } = await connectToDatabase();
  const email = req.query.email;
  if (req.method === "GET") {
    const collection = db.collection("goals");
    const user = await collection.findOne({ email });
    if (!user) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(200).json({ user });
    }
  }
};
