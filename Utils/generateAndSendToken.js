import jwt from "jsonwebtoken";

export const generateAndSendAuthToken = async (res, id) => {
  const auth_token = await jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  // console.log(auth_token);
  res.cookie("auth_token", auth_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Only secure in production
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Lax for local dev
    path: "/",
  });
//   res.cookie("auth_token", auth_token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production", // Only secure in production
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//     sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Lax for local dev
//     path: "/",
//   });

  return auth_token;
};
