import User from "../models/users.model.js"
const getUsers = async (req, res) =>{
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        console.log("Internal Servor Error", error.message);
        res.status(400).json({error : "Error while fetching Friends"});
    }

}

export default getUsers