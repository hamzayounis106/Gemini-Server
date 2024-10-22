import TempChat from "../Models/tempChat.js";

export const updateLastUsedTempChat = async (session_id) => {
  try {
    const session = await TempChat.findOne({ uuid: session_id });
    if (!session) {
      return null;
    }
    session.lastUsed = Date.now();
    await session.save();
  } catch (error) {
    console.log("Updating Last Save of:  " + session_id + "   " + error);
  }
};
