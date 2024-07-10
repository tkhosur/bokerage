import { prismaClient } from "../lib/prisma.js";

export const getUsers = async (req, res) => {
    try {
        const users = await prismaClient.user.findMany();
        res.status(200).json({ message: "Successfully fetched", data: users });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to get users"})
    }
}

export const getUser = async(req, res) => {
    const id = req.params.id;

    try {
        const user = await prismaClient.user.findUnique({
            where: {
                id: Number(id),
            }
        });
        const { password, ...userWithoutPassword } = user; 
        res.status(200).json({ message: "Successfully fetched", data: userWithoutPassword });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to get user"})
    }
};

export const updateUser = async (req, res) => {
    const id = Number(req.params.id);
    const tokenUserId = req.userId;
    const body = req.body;

    if(id !== tokenUserId) {
        return res.status(403).json({ message: 'Not Authorized' })
    }

    try {
        const userInfo = await prismaClient.user.update({
            where: { id },
            data: body
        });

        const { password, ...rest } = userInfo;

        res.status(200).json({ message: "Upated Successfully", userInfo: rest })
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to update user"})
    }
};

export const deleteUser = async (req, res) => {
    const id = Number(req.params.id);
    const tokenUserId = req.userId;

    if(id !== tokenUserId) {
        return res.status(403).json({ message: 'Not Authorized' })
    }

    try {
        const deleteUser = await prismaClient.user.delete({
            where: { id }
        });
        res.status(200).json({ message: "Deleted user Successfully", user: deleteUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to delete user"})
    }
};

export const savePost = async (req, res) => {
    const postId = req.body.postId;
    const tokenUserId = req.userId;
    try {
        const savedPost = await prismaClient.savedPost.findUnique({
            where:{
                userId_postId: {
                    userId: tokenUserId,
                    postId
                }
            }
        });

        if(savedPost) {
            await prismaClient.savedPost.delete({
                where: {
                    id: savedPost.id
                }
            });
            res.status(200).json({ message: "Post Removed from saved list" });
        } else {
            await prismaClient.savedPost.create({
                data: {
                    userId: tokenUserId,
                    postId: postId
                }
            });
            res.status(200).json({ message: "Post has been saved...😊" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to delete user"})
    }
};

export const profilePosts = async (req, res) => {
    const tokenUserId = req.params.userId;

    try {
        const userPosts = await prismaClient.post.findMany({
            where: {
                userId: tokenUserId
            },
            include: {
                images: {
                    select: {
                        url: true
                    }
                }
            }
        });

        const saved = await prismaClient.savedPost.findMany({
            where: {
                userId: tokenUserId,
            },
            include: {
                post: {
                    include: {
                        images: {
                            select: {
                                url: true
                            }
                        }
                    }
                },
            }
        });

        const savedPosts = saved.map(item => item.post);

        res.status(200).json({ userPosts, savedPosts });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to profile posts"})
    }
};