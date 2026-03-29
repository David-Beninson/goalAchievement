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
  name: { type: String, required: [true, "Please provide a name"] },
  email: { type: String, required: [true, "Please provide an email"], unique: true },
  password: { type: String, required: [true, "Please provide a password"] },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  streak: { type: Number, default: 0 },
  lastCompletedDate: { type: Date },
  goals: [GoalItemSchema],
}, { timestamps: true });

// Using 'User' as the model name as suggested by the user's friend
const Users = models.User || model("User", UserSchema);

export default Users;
