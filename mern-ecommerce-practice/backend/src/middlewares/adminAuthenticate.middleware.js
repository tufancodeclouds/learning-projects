import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const adminAuthenticate = asyncHandler(async (req, _, next) => {
  const token =
    req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized: No token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (decoded?.email !== process.env.ADMIN_EMAIL) {
      throw new ApiError(403, "Forbidden: Admin access only");
    }

    req.admin = { email: decoded.email }; // Optional: forward admin info
    next();
  } catch (err) {
    throw new ApiError(401, "Invalid or Expired Access Token");
  }
});

export { adminAuthenticate };
