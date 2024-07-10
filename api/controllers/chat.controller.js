import { prismaClient } from "../lib/prisma.js";

export const getChats = async (req, res) => {
    const tokenUserId = parseInt(req.userId);
    try {
        const userChats = await prismaClient.chat.findMany({
            where: {
                users: {
                    some: {
                        id: tokenUserId
                    }
                }
            },
            include: {
                users: true
            }
        });

        for(let chat of userChats) {
            const reciverId = chat.users.find(id => id !== tokenUserId);

            const reciver = await prismaClient.user.findUnique({
                where: {
                    id: reciverId.id
                },
                select: {
                    id: true,
                    username: true,
                    avatar: true
                }
            });
            chat['reciver'] = reciver;
        }
        res.status(200).json({ message: "Successfully fetched all chats.", userChats });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to get chats" });
    }
}

export const getChat = async (req, res) => {
    const tokenUserId = req.userId;

    try {
        const chat = await prismaClient.chat.findUnique({
            where: {
                id: parseInt(req.params.id),
                users: {
                    some: {
                        id: tokenUserId
                    }
                },
            },
            include: {
                users: true,
                message: {
                    orderBy: {
                        created_at: 'asc'
                    }
                }
            }
        });

        // Update seenBy field
        if (chat && chat.seenBy) {
            let seenByArray;
            try {
                seenByArray = JSON.parse(chat.seenBy);
            } catch (error) {
                console.error("Error parsing seenBy:", error);
                seenByArray = [];
            }

            if (!seenByArray.includes(tokenUserId)) {
                seenByArray.push(tokenUserId);

                await prismaClient.chat.update({
                    where: {
                        id: chat.id
                    },
                    data: {
                        seenBy: JSON.stringify(seenByArray)
                    }
                });
            }
        } else {
            // Handle case where seenBy is empty or null
            await prismaClient.chat.update({
                where: {
                    id: chat.id
                },
                data: {
                    seenBy: JSON.stringify([tokenUserId]) // Initialize seenBy with the current user
                }
            });
        }

        res.status(200).json({ message: "Successfully got the chat", chat });
    } catch (error) {
        console.error("Error fetching or updating chat:", error);
        res.status(500).json({ message: "Failed to get chat" });
    }
};


export const addChat = async (req, res) => {
    const tokenUserId = req.userId;
    const reciverId = req.body.reciverId;

    try {
        const newChat = await prismaClient.chat.create({
            data: {
                users: {
                    connect: [{ id: tokenUserId }, { id: reciverId }],
                },
                seenBy: "[]"
            },
            include: {
                users: true,
            }
        });
        res.status(200).json(newChat);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to add chat!" });
    }
}

export const readChat = async (req, res) => {
    const tokenUserId = req.userId;

    try {
        await prismaClient.chat.update({
            where: {
                id: parseInt(req.params.id),
                users: {
                    some: {
                        id: tokenUserId
                    }
                }
            },
            data: {
                seenBy: {
                    push: [tokenUserId]
                }
            },
            include: {
                users: true
            }
        });

        res.status(200).json({ message: "Chat read successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to read chats" });
    }
}