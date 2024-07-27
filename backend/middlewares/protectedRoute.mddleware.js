import jwt from "jsonwebtoken"
import User from '../models/users.model.js'
const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(!token)
        res.status(401).json({error: "Unautharized Request"});
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(!decoded)
        res.status(401).json({error : "Unautharizes - invalid Token"});
        const user = await User.findById(decoded.userId).select("-password");
        if(!user)
        res.status(401).json({error : "Unautharized - User does not exist"});
        req.user = user;

        next();
    } catch (error) {
        console.log("Internal Servor Error", error.message);
        res.status(400).json({error : "Error whileAuthorizing"});
    }
}

export default protectRoute;