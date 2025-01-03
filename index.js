import express from "express";
import bodyParser from "body-parser";
import { connectDB } from "./db.js";
import {jwtAuthMiddleware} from "./jwt.js";

import userRoutes from "./routes/userRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
//import userController from './controllers/usercontroller.js';

 //import testRoute from "./routes/test.js"

const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;



// Routes
app.use("/user", userRoutes);
app.use("/candidate", jwtAuthMiddleware, candidateRoutes);
//app.use("/testing", testRoute)

// Start the server
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
    connectDB();



});