import mongoose from "mongoose";
const ChatScheema = mongoose.Schema({
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
  title: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

ChatScheema.index({ lastUsed: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 });
// Scheema Middlewares
ChatScheema.pre("save", async function (next) {
  if (this.isNew) {
    await mongoose.model("User").updateOne(
      { _id: this.user },
      {
        $push: {
          chats: {
            $each: [{ id: this._id, uuid: this.uuid, title: this.title }],
            $position: 0,
          },
        },
      }
    );
  }
  next();
});
ChatScheema.post("findOneAndDelete", async function (doc, next) {
  if (doc) {
    console.log("deleteOne from post: " + doc._id);

    await mongoose
      .model("User")
      .updateOne({ _id: doc.user }, { $pull: { chats: { id: doc._id } } });
  } else {
    console.log("Nd doc is found");
  }
  next();
});

const Chat = mongoose.model("Chat", ChatScheema);
export default Chat;
