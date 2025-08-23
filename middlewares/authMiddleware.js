import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const protect = async (req, res, next) => {
    const token = req.headers.authorization 
    // console.log("Token:", token);

    if (!token) return res.status(401).json({ message: "No token, authorization denied" });

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
}