// let sessions = [];

// export const addSession = (uu_session_id) => {
//   if (uu_session_id) {
//     sessions.push({ uu_session_id, history: [] });
//   }
// };

// export const getAllSessions = () => {
//   return sessions;
// };


import { creatChatTitle } from "../Gemini/promptBasedRun.js";
import Chat from "../Models/Chat.logged.js";
import TempChat from "../Models/tempChat.js";
import User from "../Models/User.model.js";

export const addSession = async (uu_session_id) => {
  console.log("Creating annonymus session for : " + uu_session_id);

  try {
    const session = new TempChat({ uuid: uu_session_id });
    await session.save();
  } catch (error) {
    console.log("Error creating temp chat session : " + error);
  }
};

export const getAllSessions = async () => {
  let sessions;
  try {
    sessions = await TempChat.find();
    // console.log(sessions);
  } catch (error) {
    console.log("Error getting all sessions:  " + error);
  }
  return sessions;
};
export const addUserloggedSessions = async (uu_session_id, userId, prompt) => {
  const titleChat = await creatChatTitle(prompt);
  if (!titleChat) {
    return { success: false, message: "Unable to create TitleChat" };
  }
  const user = await User.findById(userId);
  if (!user) {

    return { success: false, message: "User not found" };
  }

  try {
    console.log(user._id);
    const loggedInSession = new Chat({
      uuid: uu_session_id,
      user: user._id,
      title: titleChat,
    });
    await loggedInSession.save();
    return { success: true, message: "Session Created" };
  } catch (error) {
    console.log("Error creating logged in session: " + error);
    return { success: false, message: "Unable to create session" };
  }
};
