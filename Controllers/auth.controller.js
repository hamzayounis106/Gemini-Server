import env from "dotenv";
import { OAuth2Client } from "google-auth-library";
import User from "../Models/User.model.js";
import { generateAndSendAuthToken } from "../Utils/generateAndSendToken.js";
env.config();
const GoogleClientId = process.env.GoogleClientId;
const client = new OAuth2Client();

export const login = async (req, res) => {
  res.send("login");
};
export const log_out = async (req, res) => {
  const authToken = req.cookies.auth_token;
  if (authToken) {

    res.clearCookie("auth_token", { path: "/" });
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } else {
    return res
      .status(401)
      .json({ success: false, message: "Auth token not found" });
  }
};

export const google_callback = async (req, res) => {
  // console.log("Google callback initiated");
  const { credential } = req.body;

  if (!credential) {
    console.log("Credential not received from Client");
    return res.status(400).json({
      success: false,
      message: "Google Login failed - Credential not found",
    });
  }

  try {
    // console.log("Verifying ID Token with Google");
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GoogleClientId,
    });

    const payLoad = ticket.getPayload();
    if (!payLoad) {
      throw new Error("No payload found in the ID token");
    }

    // console.log("Payload received from Google:", payLoad);
    const { sub, email, name, picture } = payLoad;

    if (!sub || !email || !name || !picture) {
      throw new Error("Complete data not found in the ID token from Google Auth");
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (user) {
      // console.log("User already exists, logging in...");
      const { _id, googleId, ...sentUser } = user.toObject();
      await generateAndSendAuthToken(res, user._id);
      return res.status(200).json({
        success: true,
        message: "User already exists... logging in",
        sentUser,
      });
    }

    // console.log("User does not exist, creating a new user");
    const newUser = new User({
      name,
      email,
      profile_image: picture,
      googleId: sub,
    });

    const createdUser = await newUser.save();
    // console.log("New user created:", createdUser);

    if (createdUser) {
      await generateAndSendAuthToken(res, createdUser._id);
      return res.status(200).json({
        success: true,
        message: "User created successfully",
        createdUser,
      });
    }
  } catch (error) {
    console.log("Error in Google callback:", error.message);
    return res.status(400).json({
      success: false,
      message: "Google Login failed - Internal Server Error",
      error: error.message,
    });
  }
};


export const checkAuth = async (req, res) => {
  const { id } = req.id;
  console.log(id);
  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      console.log("user not found")
      return res
        .status(401)
        .json({ success: false, message: "user not found" });
    }
    const { _id, googleId, ...sentUser } = user.toObject();
    // console.log(sentUser);
    return res
      .status(200)
      .json({ success: true, message: "user found successfully", sentUser });
  } catch (error) {
    console.log("Error in the check auth controller : " + error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};