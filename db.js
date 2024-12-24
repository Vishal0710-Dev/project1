import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoURL = process.env.MONGODB_URL_LOCAL
export const connectDB = () => {
    mongoose.connect(mongoURL)
        .then(() => console.log('MongoDB connected'))
        .catch((err) => console.error('MongoDB connection error:', err));
};

// mongoose.connect('mongodb://yourMongoURI', { 
//     ssl: true, 
//     sslValidate: false,  // Use this only if you don’t need SSL certificate validation
//     sslCA: fs.readFileSync('/path/to/ca.pem'),  // Optional: if you have custom CA
// });
