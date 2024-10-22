import mongoose, { Schema } from "mongoose";
const UserSchema = new Schema({
  googleId: { type: String, required: true },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  profile_image: {
    type: String,
  },
  joining_date: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  chats: [
    {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
      title: { type: String },
      uuid: { type: String },
    },
  ],
  plan: {
    type: String,
    default: "Free",
    required: true,
  },
});
const User = mongoose.model("User", UserSchema);

export default User;
