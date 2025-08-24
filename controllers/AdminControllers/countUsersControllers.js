import {User} from "../../models/User.js";
import {StoreOwner} from "../../models/StoreOwner.js";
import { RatingCounter } from "../../models/RatingCounter.js";

export const countUsers = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalStores = await StoreOwner.countDocuments();
        const counter = await RatingCounter.findOne();
        const totalRatings = counter ? counter.count : 0;
        
        res.json({totalUsers, totalStores, totalRatings});
    } catch (error) {
        res.status(500)
        .json({message: "Error counting users...", error});
    }
}

export const getUsersList = async (req, res) => {
    try {
        const users = await User.find().select("name email address role");
        const partitioned = {
            normalUsers: users.filter(user => user.role === "NormalUser"),
            storeOwners: users.filter(user => user.role === "StoreOwner"),
            systemAdmins: users.filter(user => user.role === "SystemAdmin")
        };
        // console.log(partitioned);
        res.json(partitioned);
    } catch (error) {
        res.status(500)
        .json({message: "Error fetching users list...", error});
    }
}