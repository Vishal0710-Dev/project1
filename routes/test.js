import express from 'express';

import User from '../models/user.js'; // Use .js for module imports
import { jwtAuthMiddleware, generateToken } from '../jwt.js'; // Use named import for jwtAuthMiddleware and generateToken

const router = express.Router();

router.post('/signup', async (req, res) =>{
    console.log('route is running')
})



export default router

