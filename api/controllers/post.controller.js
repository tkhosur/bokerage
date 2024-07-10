import jwt from 'jsonwebtoken';
import { prismaClient } from '../lib/prisma.js';

export const getPosts = async (req, res) => {
    const query = req.query;

    try {
        const response = await prismaClient.post.findMany({
            where: {
                city: query.city || undefined,
                type: query.type || undefined,
                property: query.property || undefined,
                beadroom: parseInt(query.beadroom) || undefined,
                type: query.type || undefined,
                price: {
                    gte: parseInt(query.minPrice) || 0,
                    lte: parseInt(query.maxPrice) || 10000000
                }
            },
            include: {
                images: {
                    select: {
                        url: true,
                    }
                },
            },
            orderBy: {
                id: 'desc',
            }
        });

        res.status(200).json({ message: "Successfully fetched Posts", data: response });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to Fetch Posts" });
    }
};

export const getPost = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const response = await prismaClient.post.findUnique({
            where: { id },
            include: {
                postDetail: true,
                images: {
                    select: {
                        url: true,
                    }
                },
                user: {
                    select: {
                        username: true,
                        avatar: true
                    }
                }
            }
        });

        // if there is no response
        if (!response) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Transform the images array to include only URLs.
        const images = response.images.map(image => image.url);

        let userId;
        const token = req.cookies.token;

        if(!token) {
            userId = null;
        } else {
            jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
                if(err) {
                    userId = null;
                } else {
                    userId = payload.id;
                }
            })
        }

        const saved = await prismaClient.savedPost.findUnique({
            where: {
                userId_postId: {
                    postId: id,
                    userId,
                }
            },
        });
        // Construct the response data
        const responseData = {
            ...response,
            images,
            isSaved: saved ? true : false
        };

        res.status(200).json({ message: "Successfully fetched Posts", data: responseData });
    } catch (error) {
        res.status(500).json({ message: "Failed or there is no such post to Fetch." });
    }
};

export const createPost = async (req, res) => {
    let { images } = req.body;
    const body = req.body;
    const tokenUserId = parseInt(req.userId);

    // Validate tokenUserId
    if (isNaN(tokenUserId)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    images = images.map(image => ({ url: image }))

    try {
        await prismaClient.post.create({
            data: {
                ...body.postData,
                userId: tokenUserId,
                postDetail: {
                    create: body.postDetail
                },
                images: {
                    create: images
                }
            }
        });
        res.status(200).json({ message: "Successfully created your post" });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ message: "Failed to create post." });
    }
};

export const updatePost = (req, res) => {
    try {
        res.status(200).json({ });
    } catch (error) {
        res.status(500).json({ message: "Failed or there is no such post to Fetch." });
    }
}

export const deletePost = async (req, res) => {
    const postId = parseInt(req.params.id);
    const tokenUserId = req.userId;

    try {
        const post = await prismaClient.post.findUnique({
            where:{ postId }
        });

        if(post.userId !== tokenUserId) {
            return res.status(403).json({ message: "You are not authorized to delete this post"});
        }

        const deletedPost = await prismaClient.post.delete({
            where:{ postId }
        })

        res.status(200).json({ message: "Post has been deleted Successfully", deletedPost })
    } catch (error) {
        res.status(500).json({ message: "Failed or there is no such post to Fetch." });
    }
}