//ignore this file, not being used anywhere
import { GoogleGenerativeAI } from "@google/generative-ai";
import env from "dotenv";
import fs from "fs";
import axios from "axios";
env.config();
const GoogleAPI = process.env.GOOGLE_API_KEY;
// console.log(GoogleAPI);
const genAI = new GoogleGenerativeAI(GoogleAPI);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//  1-Text input and getting text output

async function generateAIText() {
  const prompt =
    "Can i use you to create a model to filter out nudity and negative psoted images on my website, for that i might have to provide you such images to check the responses?";
  const res = await model.generateContent(prompt);
  const result = await res.response;
  const text = result.text();
  console.log(text);
}
// generateAIText();

//  2-Image + Text input and getting text output
//file information to a GoogleGenerativeAI.Part
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
}
async function imageAndTextInputToTextOutput() {
  const prompt = "How would you rate this email template i made? ";
  console.log("prompt:", prompt);
  const imagePart = fileToGenerativePart("emailTemplate.png", "image/jpeg");
  const result = await model.generateContent([prompt, imagePart]);
  const res = await result.response;
  const text = res.text();
  console.log(text);
}

// imageAndTextInputToTextOutput();

//  3-ImageURL + Text input and getting text output
//file information to a GoogleGenerativeAI.Part
async function fileURLToGenerativePart(url, mimeType) {
  console.log("url:", url);
  try {
    const res = await axios.get(url, { responseType: "arraybuffer" });
    console.log("res.data:", res.data);
    return {
      inlineData: {
        data: Buffer.from(res.data).toString("base64"),
        mimeType,
      },
    };
  } catch (error) {
    console.error(error);
  }
}
async function imageURLAndTextInputToTextOutput() {
  const prompt = "What is in the image ";
  console.log("prompt:", prompt);
  const imagePart = await fileURLToGenerativePart(
    "https://raw.githubusercontent.com/hamzayounis-105/2024Images/main/sideImage2.png",
    "image/jpeg"
  );
  const result = await model.generateContent([prompt, imagePart]);
  const res = await result.response;
  const text = res.text();
  console.log(text);
}

imageURLAndTextInputToTextOutput();
