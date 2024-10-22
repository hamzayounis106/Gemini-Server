import { GoogleGenerativeAI } from "@google/generative-ai";

import TempChat from "../Models/tempChat.js";
import Chat from "../Models/Chat.logged.js";

const safe = {
  HARM_CATEGORY_HARASSMENT: "BLOCK_NONE",
  HARM_CATEGORY_HATE_SPEECH: "BLOCK_NONE",
  HARM_CATEGORY_SEXUALLY_EXPLICIT: "BLOCK_NONE",
  HARM_CATEGORY_DANGEROUS_CONTENT: "BLOCK_NONE",
};

const GoogleAPI = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(GoogleAPI);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", safe });

export const promptBasedRun = async (prompt, anonymousUUID) => {
  try {
    let session = await TempChat.findOne({ uuid: anonymousUUID });
    if (!session || !prompt ) {
      return {
        success: false,
        message: "no session found in promptBasedRun",
      };
    }

    let history = session.history;

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(prompt);
    const text = await (await result.response).text();
    session.lastUsed = Date.now();
    session.history = history;
    await session.save();
    console.log(text);
    return text;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: error.message,
    };
  }
};
export const promptBasedRunLoggedIn = async (prompt, session_UUID, id) => {
  try {
    let session = await Chat.findOne({ uuid: session_UUID });
    if (!session) {
      return {
        success: false,
        message: "no session found in promptBasedRunLoggedIn",
      };
    }
    let history = session.history;
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(prompt);
    const text = await (await result.response).text();
    session.lastUsed = Date.now();
    session.history = history;
    await session.save();
    return text;
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};
export const creatChatTitle = async (prompt) => {
  // let history = [];
  const chat = model.startChat([]);
  try {
    const promptMessage = `Generate a short, positive conversation title with exactly 2-3 words, based on the following content: "${prompt}". Avoid using quotation marks or extra words.`;

    const result = await chat.sendMessage(promptMessage);
    const res = await result.response;
    const title = await res.text();
    return title;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};
