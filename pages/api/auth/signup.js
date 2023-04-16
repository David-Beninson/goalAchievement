import connectMongo from "../../../database/conn";
import UserSchema from "../../../model/UserSchema";
import { hash } from "bcryptjs";

export default async function handler(req, res) {
  try {
    await connectMongo();
    console.log("connected"); // wait for the database connection to establish
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Database connection failed" });
  }

  // Only POST method is accepted
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Check if request body is empty
  if (!req.body) {
    return res.status(400).json({ error: "Request body cannot be empty" });
  }

  const { username, email, password } = req.body;

  // Check if email is already registered
  const existingUser = await UserSchema.findOne({ email });
  if (existingUser) {
    return res.status(422).json({ error: "User Already Exists" });
  }

  // Create a new user
  try {
    const hashedPassword = await hash(password, 12);
    const newUser = await UserSchema.create({
      username,
      email,
      password: hashedPassword,
    });
    res.status(201).json({ status: true, user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user" });
  }
}
