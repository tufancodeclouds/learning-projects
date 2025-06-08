import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
};

// For user only
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating access and refresh token");
  }
};

const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const emailExists = await User.findOne({ email });
  if (emailExists) {
    return next(new ApiError(409, "Email already exists"));
  }

  const user = await User.create({ name, email, password });

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  const createdUser = await User.findById(user._id).select("-password -refreshToken");
  if (!createdUser) {
    return next(new ApiError(500, "Something went wrong while registering the user"));
  }

  return res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(200, { user: createdUser, accessToken, refreshToken }, "User Registered Successfully"));
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    return next(new ApiError(400, "Email is required"));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError(404, "User does not exist"));
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    return next(new ApiError(401, "Password is incorrect"));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User Logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(400, "User not authenticated");
  }

  await User.findByIdAndUpdate(req.user._id, { refreshToken: null }, { new: true });

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User Logged Out Successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken || req.header("Authorization")?.replace("Bearer ", "");
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is missing or not provided");
  }

  const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
  const user = await User.findById(decodedToken?._id);

  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  if (incomingRefreshToken !== user.refreshToken) {
    throw new ApiError(401, "Refresh token mismatch or already used");
  }

  const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user._id);

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", newRefreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken: newRefreshToken },
        "Access Token Refreshed Successfully"
      )
    );
});

const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });

    const refreshToken = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });

    return res
      .cookie("adminAccessToken", accessToken, cookieOptions)
      .cookie("adminRefreshToken", refreshToken, cookieOptions)
      .status(200)
      .json(
        new ApiResponse(200, { accessToken, refreshToken }, "Admin Login Successful")
      );
  }

  throw new ApiError(401, "Invalid credentials");
});

const adminRefreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.adminRefreshToken;
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token missing");
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    if (decoded.email !== process.env.ADMIN_EMAIL) {
      throw new ApiError(403, "Forbidden: Invalid refresh token");
    }

    const newAccessToken = jwt.sign(
      { email: decoded.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    res
      .cookie("adminAccessToken", newAccessToken, cookieOptions)
      .json(
        new ApiResponse(200, { accessToken: newAccessToken }, "Access token refreshed")
      );
  } catch (err) {
    throw new ApiError(401, "Invalid or Expired Refresh Token");
  }
});

const adminLogout = asyncHandler(async (req, res) => {
  res.clearCookie("adminAccessToken", cookieOptions);
  res.clearCookie("adminRefreshToken", cookieOptions);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Admin logged out successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  adminLogin,
  adminRefreshAccessToken,
  adminLogout
};
