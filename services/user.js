import User from "../models/user.js";
import bcrypt from "bcrypt";
import { generateToken } from "../jwt.js";

export const signupUser = async (data) => {
  const newUser = new User(data);
  const response = await newUser.save();
  const payload = { id: response.id };
  const token = generateToken(payload);
  return { response, token };
};

export const loginUser = async (aadharCardNumber, password) => {
  const user = await User.findOne({ aadharCardNumber });
  if (!user) {
    throw new Error("Invalid aadharCard and password");
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch){
     throw new Error("Invalid password");
}

  const payload = { id: user.id };
  const token = generateToken(payload);
  return { token };
};

export const getUserProfile = async (userId) => {
  const user = await User.findById(userId, "name");
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export const updatePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordMatch) throw new Error("Current password is incorrect");

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  return { message: "Password updated successfully" };
};
