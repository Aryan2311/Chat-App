import Conversation from '../models/conversation.model.js'
import Message from '../models/messages.model.js'
export const sendMessages = async (req, res) =>{
    try {
        const receiverId = req.params.id;
        const senderId = req.user._id;
        const {message} = req.body;
    
        let conversation = await Conversation.findOne({
            participants : { $all : [receiverId, senderId]}
        })
        if(!conversation)
        conversation = new Conversation({
            participants : [receiverId, senderId]
        });
        const newmessage = new Message({
            senderId,
            receiverId,
            message
        });
        if(newmessage){
        conversation.messages.push(newmessage._id);
    }

        await conversation.save();
        await newmessage.save();

        res.status(200).json({
            receiverId,
            senderId,
            message,
            conversationId : conversation._id
        })

    } catch (error) {
        console.log("Internal servor error", error.message);
        res.status(400).json({erro : "Error while Sending Message"});
    }
}
export const getMessages = async (req, res) =>{
    try {
        const chatterId = req.params.id;
        const userId = req.user._id;
        const conversation = await Conversation.findOne({
            participants : {$all : [chatterId, userId]}
        }).populate("messages")

        if(!conversation)
        res.status(200).json([]);

        const messages = conversation.messages
        res.status(200).json({messages});
    } catch (error) {
        console.log("Internal Servor Error", error.message);
        res.status(400).json({error : "Error while fetching Messages"});
    }
}