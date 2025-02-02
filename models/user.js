import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String
    },
    mobile: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    aadharCardNumber: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter'
    },
    isVoted: {
        type: Boolean,
        default: false
    },
    WardNumber: {
        type: Number,
        enum:[1, 2, 3, 4],
        required: true
    }
});


userSchema.pre('save', async function(next){
        const user = this;
    
        if(!this.isModified('password')) return next();
    
        try{
            const salt = await bcrypt.genSalt(10)
    
           const hashPassword = await bcrypt.hash(user.password, salt);
    
           user.password = hashPassword;
           next();
        }catch(err){
            return next(err);
        }
    })
    
    userSchema.methods.comaprePassword = async function(candidatePassword){
        try{
            const isMatch = await bcrypt.compare(candidatePassword, this.password);
            return isMatch;
        }catch(err){
            throw err;
        }
    }


const User = mongoose.model('User', userSchema);
export default User
