import Conversation from '../models/conversation.model.js'
import Message from '../models/messages.model.js'

export const sendMessages = async (req, res) => {
    try {
        const receiverId = req.params.id;
        const senderId = req.user._id;
        const { message } = req.body;

        let conversation = await Conversation.findOne({
            participants: { $all: [receiverId, senderId] }
        });
        if (!conversation) {
            conversation = new Conversation({
                participants: [receiverId, senderId]
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message
        });
        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        await conversation.save();
        await newMessage.save();

        return res.status(200).json({
            receiverId,
            senderId,
            message,
            conversationId: conversation._id
        });

    } catch (error) {
        console.log("Internal server error", error.message);
        return res.status(400).json({ error: "Error while Sending Message" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const chatterId = req.params.id;
        const userId = req.user._id;
        const conversation = await Conversation.findOne({
            participants: { $all: [chatterId, userId] }
        }).populate("messages");

        if (!conversation) {
            return res.status(200).json([]);
        }

        const messages = conversation.messages;
        return res.status(200).json({ messages });
    } catch (error) {
        console.log("Internal Server Error", error.message);
        return res.status(400).json({ error: "Error while fetching Messages" });
    }
};
