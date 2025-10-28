import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';



// Signup a new user
export const signup = async(req, res) => {
    const {fullName, email, password, bio} = req.body;

    try{
        if(!fullName || !email || !password){
            return res.json({success: false, message: "Missing Details"});
        }

        // Check if user already exists
        const user = await User.findOne({email});
        if(user){
            return res.json({success: false, message: "User already exists"});
        }

        // Encrypt the password using bcrypt
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            bio
        });

        // Create a token
        const token = generateToken(newUser._id);

        res.json({success: true, userData: newUser, token, message: "Account Created Successfully"});

    }catch(err){
        console.log(err.message);
        res.json({success: false, message: err.message});
    }
}


// Login a user
export const login = async(req, res) => {
    try{
        const {email, password} = req.body;
        const userData = await User.findOne({email})

        // Check if user exists
        if(!userData){
            return res.json({success: false, message: "User not found"});
        }

        // Check if password is correct
        const isPasswordCorrrect = await bcrypt.compare(password, userData.password);
        if(!isPasswordCorrrect){
            return res.json({success: false, message: "Invalid credentials"});
        }

        // Create a token
        const token = generateToken(userData._id);

        res.json({success: true, userData, token, message: "Login Successful"});
    }catch(err){
        console.log(err.message);
        res.json({success: false, message: err.message});
    }
}


// Controller to check if user is authenticated
// Here the req.user is set in the authMiddleware
// auth.js authenticates the user and sets the req.user
export const checkAuth = (req, res) => {
    res.json({success: true, user: req.user});
}

// Controller to update user profile details
export const updateProfile = async(req, res) => {
    try{
        const {profilePicture, bio, fullName} = req.body;
        const userId = req.user._id;
        let updatedUser;

        if(!profilePicture){
            updatedUser = await User.findByIdAndUpdate(userId, {bio, fullName}, {new: true});
        }else{
            const upload = await cloudinary.uploader.upload(profilePicture);
            updatedUser = await User.findByIdAndUpdate(userId, {profilePicture: upload.secure_url, bio, fullName}, {new: true});
        }

        res.json({success: true, user: updatedUser});

    }catch(err){
        console.log(err.message);
        res.json({success: false, message: err.message});
    }
}