import {
  promptBasedRun,
  promptBasedRunLoggedIn,
} from "../Gemini/promptBasedRun.js";
import Chat from "../Models/Chat.logged.js";
import TempChat from "../Models/tempChat.js";
import User from "../Models/User.model.js";
import { updateLastUsedTempChat } from "../Utils/updateLastUsedTempChat.js";

export const test = async (req, res) => {
  console.log("API called");
  const text = await promptBasedRun("test prompt");
  ``;
  res.send(text);
};
export const sendPrompt = async (req, res) => {
  try {
    let session_UUID = req.query.s;
    let anonymousUUID = req.query.a;
    let prompt = req.body.prompt;

    // Catch

    if ((!session_UUID && !anonymousUUID) || !prompt) {
      return res.status(400).json({
        success: false,
        message: "((!session_UUID && !anonymousUUID) || !prompt) triggered",
        session_UUID,
        anonymousUUID,
        prompt,
      });
    }

    let reply = null;

    if (req.id) {
      const { id } = req.id;

      //If user is logged in

      reply = await promptBasedRunLoggedIn(prompt, session_UUID, id);
    } else {
      //If user is anonymous

      reply = await promptBasedRun(prompt, anonymousUUID);
    }
    if (reply.success === false) {
      console.log(reply);
      return res.status(500).json(reply);
    }

    const data = [
      {
        role: "user",
        message: prompt,
      },
      {
        role: "model",
        message: reply,
      },
    ];
    console.log(data);
    res.send(data);
  } catch (error) {
    console.error("Error in sendPrompt:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const getHistory = async (req, res) => {
  let session_UUID = req.query.s;
  if (req.id) {
    const { id } = req.id;
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found in getHistory");
    }
    if (!session_UUID) {
      return res
        .status(400)
        .json({ success: false, message: "No session uid received" });
    }
    try {
      let session = await Chat.findOne({ uuid: session_UUID });
      if (session) {
        // updateLastUsedTempChat(session_UUID);
        session.lastUsed = Date.now();
        await session.save();
        return res
          .status(200)
          .json({ success: true, history: session.history });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Session not found" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
    return;
  }

  // console.log(session_UUID);
  if (!session_UUID) {
    return res
      .status(400)
      .json({ success: false, message: "No session uid received" });
  }

  try {
    // let sessions = getAllSessions();
    // let session = sessions.find((ses) => ses.uu_session_id === session_UUID);
    let session = await TempChat.findOne({ uuid: session_UUID });

    if (session) {
      updateLastUsedTempChat(session_UUID);
      return res.status(200).json({ success: true, history: session.history });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteChat = async (req, res) => {
  const { uuid } = req.body;
  if (!uuid) {
    console.log("UUID not found in request header while deleting post");
    return res.status(404).json({
      success: false,
      message: "UUID not found in request header while deleting post",
    });
  }
  try {
    const chat = await Chat.findOneAndDelete({ uuid: uuid });
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Chat deleted Succefully!",
    });
  } catch (error) {
    console.error("Error deleting chat:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
