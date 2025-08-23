import {User} from "../models/User.js";
import {StoreOwner} from "../models/StoreOwner.js";
import {NormalUser} from "../models/NormalUser.js"; 
import {SystemAdmin} from "../models/SystemAdmin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const {name, role, email, password, address, contactNumber, storeName, storeLocation} = req.body;

        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400)
            .json({message: "Email already exists..."})
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            role,
            password: hashedPassword,
            address,
            contactNumber
        });

        await user.save();

        if(role === "NormalUser"){
            await NormalUser.create({ userId: user._id });
        }
        else if(role === "StoreOwner"){
            await StoreOwner.create({
                userId: user._id,
                storeName,
                storeLocation
            });
        }
        else if(role === "SystemAdmin"){
            await SystemAdmin.create({userId: user._id});
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // send response
        const { password: pw, ...rest } = user._doc;

        res.status(201)
        .json({
            message: "User Registered Successfully...",
            token,
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address,
                contactNumber: user.contactNumber
            }
        });
    } catch (error) {
        console.error("Registration Error...",error);
        res.status(500)
        .json({message: "Registration Failed...",error: error.message});
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({ email });
        if(!user){
            return res.status(400)
            .json({message: "User not Registered..."});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400)
            .json({message: "Invalid Credentials..."});
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        const {password:pw, ...rest} = user._doc;
        res.status(200)
        .json({
            message: "Login Successful...",
            token,
            user: rest
        });
    } catch (error) {
        console.error("Login Error...", error);
        res.status(500)
        .json({
            message: "Login Failed...",
            error: error.message
        })
    }
};