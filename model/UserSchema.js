import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  username: String,
  email: String,
  password: String,
  goals: Array,
});

const Users = models.Goals || model("Goals", UserSchema);

export default Users;
