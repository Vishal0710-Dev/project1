import express from 'express';
import User from '../models/user.js'; // Use .js for module imports
import { jwtAuthMiddleware, generateToken } from '../jwt.js'; // Use named import for jwtAuthMiddleware and generateToken

const router = express.Router();

router.post('/signup', async (req, res) =>{
    try{
        const data = req.body

        const newUser = new User(data);
        const response = await newUser.save();
        console.log('data saved');

        const payload = {
            id: response.id,
        }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log("Token is :", token);

        res.status(200).json({response: response, token: token});
    
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
        
    }
})

router.post('/login', async(req, res) => {
    try{
        const{aadharCardNumber, password} = req.body;

        const user = await User.findOne({aadharCardNumber: aadharCardNumber});

        if( !user || !(await user.comparePass)){
            return RegExp.status(401).json({error: 'Invalid username or password'});
        }
        const payload = {
            id: user.id,
        }
        const token = generateToken(payload);

        res.json({token})
    } catch(err){
        res.status(500).json({ error: 'Internal Server Error' });

    }

});

router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try{
        const userData = req.user;
        const userId = userData.id;
        const user = await user.findById(userId);

        res.status(200).json({user});

    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error'});
    }
})

router.put('/profile/password', jwtAuthMiddleware, async(req, res)=>{
    try{
        const userId = req.user.id;
        const {currentPassword, newPassword} = req.body;

        const user = await User.findById(userId);


        if(!(await user.comparePassword(currentPassword))){
            return res.status(401).json({error: 'Invalid password'});
        }

        user.password = newPassword;
        await user.save();


        console.log('password updated');
        res.status(200).json({message: "password updated"});
    }catch(err){
        console.log(err);
        res.status(500).json({error:'Internal Server Error'});
    
    }
})

export default router
