import { prismaClient } from "../lib/prisma.js";

export const addMessage = async (req, res) => {

    const tokenUserId = parseInt(req.userId);
    const chatId = parseInt(req.params.chatId);
    const body = req.body.text;

    try {
        // Find the chat ensuring the user is part of it
        const chat = await prismaClient.chat.findUnique({
            where: {
                id: chatId,
                users: {
                    some: {
                        id: tokenUserId
                    }
                }
            }
        });

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        // Create the message
        const message = await prismaClient.message.create({
            data: {
                text: body,
                chatId: chatId,
                userId: tokenUserId
            }
        });

        // Update the seenBy and lastMessage fields in the chat
        const seenByArray = JSON.parse(chat.seenBy);
        if (!seenByArray.includes(tokenUserId)) {
            seenByArray.push(tokenUserId);
        }

        await prismaClient.chat.update({
            where: {
                id: chatId
            },
            data: {
                seenBy: JSON.stringify(seenByArray),
                lastMessage: body
            }
        });

        res.status(200).json({ message: "Successfully added message", message });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to add message" });
    }
}