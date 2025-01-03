import express from "express";
import {jwtAuthMiddleware} from "../jwt.js";
import { addCandidateController, updateCandidateController, deleteCandidateController, voteController, getVoteCountsController, } from '../controller/candidate.js';

const router = express.Router();
const checkVotingTime = (req, res, next) => {
    const currentTime = new Date();
    
    // Set the start and end time for voting
    const startTime = new Date();
    const endTime = new Date();
    
    startTime.setHours(9); // 9:00 AM
    endTime.setHours(19);  // 7:00PM

    // Check if the current time is within the voting window
    if (currentTime >= startTime && currentTime <= endTime) {
        next();
         // Continue to the next middleware if the time is valid
    } else {
        return res.status(403).json({ message: 'Voting is only allowed between 9:00 AM and 7:00 PM' });
    }
};

router.post('/', jwtAuthMiddleware, addCandidateController);
router.put('/:candidateID', jwtAuthMiddleware, updateCandidateController);
router.delete('/:candidateID', jwtAuthMiddleware, deleteCandidateController);
router.post('/vote/:candidateID', jwtAuthMiddleware,checkVotingTime, voteController);
router.get('/vote/count', getVoteCountsController);

export default router