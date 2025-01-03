import express from "express";
import{signup, login, profile, updatePasswordHandler, } from "../controller/user.js";
import {jwtAuthMiddleware } from "../jwt.js";


const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", jwtAuthMiddleware, profile);
router.put("/profile/password", jwtAuthMiddleware, updatePasswordHandler);

export default router