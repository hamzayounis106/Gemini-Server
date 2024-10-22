import mongoose from "mongoose";
const tempChatScheema = mongoose.Schema({
  uuid: {
    type: String,
    unique: true,
  },
  history: {
    type: Array,
    default: [],
  },
  lastUsed: {
    type: Date,
    default: Date.now,
  },
});
tempChatScheema.index(
  { lastUsed: 1 },
  { expireAfterSeconds: 1 * 24 * 60 * 60 }
);
const TempChat = mongoose.model("TempChat", tempChatScheema);
export default TempChat;
