import jwt from "jsonwebtoken";

export const verifyTokenConditional = async (req, res, next) => {
  const { auth_token } = req.cookies;
  if (!auth_token) {
    // console.log("In verifyTokenConditional.js the authtoke is null ")
    req.id = null;
    next();
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
  }
};
