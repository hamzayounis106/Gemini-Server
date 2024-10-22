import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  const { auth_token } = req.cookies;
  if (!auth_token) {
    return res
      .status(403)
      .json({ succes: false, message: "Auth token not found" });
  }
  try {
    const decoded = await jwt.decode(auth_token, process.env.JWT_SECRET);
    if (!decoded) {
      throw new Error("Failed to decode the token");
    }
    req.id = decoded;
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ succes: false, message: error.message });
  }
};