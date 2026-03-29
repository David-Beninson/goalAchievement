import { Schema, model, models } from "mongoose";

const StepSchema = new Schema({
  stepId: String,
  title: String,
  achieved: { type: Boolean, default: false },
});

const GoalItemSchema = new Schema({
  IdForGoal: String,
  title: String,
  description: String,
  achieved: { type: Boolean, default: false },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  deadline: { type: Date },
  steps: [StepSchema],
});

const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  streak: { type: Number, default: 0 },
  lastCompletedDate: { type: Date },
  goals: [GoalItemSchema],
});

const Users = models.Goals || model("Goals", UserSchema);

export default Users;
