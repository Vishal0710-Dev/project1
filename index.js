import express from "express";
import bodyParser from "body-parser";
import { connectDB } from "./db.js";
import {jwtAuthMiddleware} from "./jwt.js";

import userRoutes from "./routes/userRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
 //import testRoute from "./routes/test.js"

const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Check if voting is allowed based on time
function isVotingAllowed() {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    return currentHour >= 9 && currentHour < 18;
}

// Middleware to enforce voting time restrictions
function checkVotingTime(req, res, next) {
    if (!isVotingAllowed()) {
        return res.status(403).json({ error: 'Voting is only allowed between 9 AM and 6 PM' });
    }
    next();
}

// Routes
app.use("/user", userRoutes);
app.use("/candidate", jwtAuthMiddleware, candidateRoutes);
//
app.use("/testing", testRoute)

// Start the server
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
    connectDB();
});
