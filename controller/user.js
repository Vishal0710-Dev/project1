import { signupUser, loginUser, getUserProfile, updatePassword } from "../services/user.js";

export const signup = async (req, res) => {
  try {
    const data = req.body;
    const { response, token } = await signupUser(data);
    res.status(200).json({ response, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { aadharCardNumber, password } = req.body;
    const { token } = await loginUser(aadharCardNumber, password);
    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};

export const profile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await getUserProfile(userId);
    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};

export const updatePasswordHandler = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    const { message } = await updatePassword(userId, currentPassword, newPassword);
    console.log(message);
    res.status(200).json({ message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};
