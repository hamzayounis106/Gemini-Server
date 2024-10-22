import { generateUUID } from "../Utils/generateUUID.js";
import { addSession, addUserloggedSessions } from "../Utils/sessions.js";

export const newSession = async (req, res) => {
  const session_id = generateUUID();
  if (!session_id) {
    res.status(400).json({
      success: false,
      message: "!session_id",
      session_id,
    });
  }
  if (req.id) {
    const { id } = req.id;
    const prompt = req.body.prompt;

    if (!id || !prompt) {
      res.status(400).json({
        success: false,
        message: "!session_id || !id || !prompt",
        session_id,
        id,
        prompt,
      });
    }
    const sessionRes = await addUserloggedSessions(session_id, id, prompt);
    if (sessionRes.success === false) {
      res.status(400).json({
        sessionRes,
      });
    }

    res.status(200).json({ sessionId: session_id });
    return;
  }

  await addSession(session_id);

  res.status(200).json({ anonTokenId: session_id });
};
