import express from "express";
import User from "../models/users.model.js";
import bcrypt from "bcrypt"
import generateJwtToken from "../utils/jwt.utils.js";
export const signup = async (req, res)=>{
    try {
        const {fullName, username, password, confirmPassword, gender} = req.body;
        if(password !== confirmPassword)
        return res.status(400).json({error : "Passwords do not match"})

        const user = await User.findOne({username});
        if(user)
        return res.status(400).json({error : "Username already exist"});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const boyavatar = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlavatar = `https://avatar.iran.liara.run/public/girl?username=${username}`

        const newUser = new User({
            fullName,
            username,
            password : hashedPassword,
            gender,
            profilePic: gender === "Male"? boyavatar : girlavatar
        })

        if(newUser){
        //generate jwt token
        generateJwtToken(newUser._id, res);
        await newUser.save();
        return res.status(201).json({
            _id : newUser._id,
            fullName,
            username,
            profilePic : newUser.profilePic
        });
    }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        return res.status(500).json({error : "Internal Servor Error"});
    }
}
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: "Incorrect Username" });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Incorrect Password or Username" });
        }

        // Generate JWT token and set it in the response cookie
        generateJwtToken(user._id.toString(), res);

        // Send success response with user details
        res.status(200).json({
			_id: user._id,
			fullName: user.fullName,
			username: user.username,
			profilePic: user.profilePic,
		});
    } catch (error) {
        console.error("Error while Logging In:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
export const logout = async (req, res)=>{
    try {
        res.cookie('jwt', "",{maxAge : 0});
        res.status(200).json({message : "Logged out Successfully"});
    } catch (error) {
        console.log("Error while Logging In", error.message);
        res.status(500).json({error : "Internal Servor Error"});
    }
}
