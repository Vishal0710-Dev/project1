import express from 'express'
const router = express.Router();
import User from '../models/user.js'
import {jwtAuthMiddleware, generateToken}from '../jwt.js'
import Candidate from "../models/candidate.js"

// const Admin_ID = process.env.ADMIN_ID;

const isVoting = () => {
    const now = new Date();
    const currentHour = now.getHours();
    return currentHour >= 9 && currentHour < 18; // Between 9 AM and 3 PM
};
  const checkAdminRole = async (userID) =>{
    try{
        const user = await User.findById(userID);
        if(user.role === 'admin'){
            return true;
        }
    } catch(err){
        return false;
    }

 }
 //to add a candidate
router.post('/', async (req, res) =>{
    try{
        if(!(await checkAdminRole(req.user.id)))
            
            return res.status(403).json({message: 'user does not have admin role'});
        
        const data = req.body


        const newCandidate = new candidate(data);
        const response = await newCandidate.save();
        console.log('data saved');

        res.status(200).json({response: response});
    
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
        
    }
})


router.put('/:candidateID', async(req, res)=>{
    try{
        if(!checkAdminRole(req.user.id))
            return res.status(404).json({message: 'user does not have admin role'});
        
        const candidateId = req.params.candidateID;
        const updatedCandidateData = req.body;

        const response = await Candidate.findByIdAndUpdate(candidateId, updatedCandidateData,
            {
                new: true,
                runValidators: true,


       } )
       if(!response) {
        return res.status(403).json({error: 'Candidate not found'});
       }

       console.log('candidate data updated');
       res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});

    }
    })





    router.delete('/:candidateID', async(req, res)=>{
        try{
            if(!checkAdminRole(req.user.id))
                return res.status(403).json({message: 'user does not have admin role'});
            
            const candidateId = req.params.candidateID;
            
    
            const response = await Candidate.findByIdAndDelete(candidateId);
                
           if(!response) {
            return res.status(404).json({error: 'Candidate not found'});
           }
    
           console.log('candidate deleted');
           res.status(200).json(response);
        }catch(err){
            console.log(err);
            res.status(500).json({error: 'Internal Server Error'});
    
        }

})





router.post('/vote/:candidateID', isVoting,  async (req, res)=>{
    const candidateID = req.params.candidateID;
    const userId = req.user.id;

    try{

        if (!isVoting()) {
            return res.status(403).json({ message: 'Voting is only allowed between 9 AM and 6 PM' });
        }
        
        const candidate = await Candidate.findById(candidateID);
        if(!candidate){
          return res.status(404).json({ message: 'Candidate not found'});

        
        }
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: 'user not found'});
        }
        if(user.isVoted){
         res.status(400).json({ message: 'you have already voted '});

        }
        if(user.role == 'admin'){
            res.status(403).json({message: 'admin is not allowed'});
        }


        candidate.votes.push({user: userId})
        candidate.voteCount++;
        await candidate.save();


        user.isVoted = true;
        await user.save();

        res.status(200).json({ message: 'Vote recorded successfully'});
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});

    }


});

router.get('/vote/count', async (req, res) => {
    try{
        const candidate = await Candidate.find().sort({voteCount: 'desc'});

        const voteRecord = candidate.map((data)=>{
            return{
                party: data.party,
                count: data.voteCount
            }
        });
        return res.status(200).json(voteRecord)

    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});        
    }
})



export default router