import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prismaClient } from '../lib/prisma.js';

export const register = async (req, res) => {
    const { email, password, username } = req.body;

    try {
        // Hash the password.
        const hashPassword = await bcrypt.hash(password, 10);

        // Create a new user.
        const newUser = await prismaClient.user.create({
            data: {
                username: username,
                email: email,
                password: hashPassword,            
            }
        });
        res.status(200).json({message:`Account created successfully for ${newUser.username}`});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Failed to create user"});
    }
}

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user already exists in the database
        const user = await prismaClient.user.findUnique({
            where: { username: username }
        });

        if(!user) {
            return res.status(401).json({ message: 'Please provide the valid Credentials!..☹️' });
        }
        // Check if user password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            return res.status(401).json({ message: 'You have provided incorrect password!.. ☹️'})
        }

        const age = 1000 * 60 * 60 * 24 * 7;

        const { password: userPassword, ...userInfo } = user;

        const token = await jwt.sign({
            id: user.id,
            isAdmin: false,
        }, process.env.JWT_SECRET_KEY, { expiresIn: age });

        // Generate cookie token and send it to the user
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: age,
        }).status(200).json({ message: "LogedIn Successfully!.. 😊", userInfo})
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to login!..☹️☹️"})
    }
}

export const logout = (req, res) => {
    res.clearCookie("token").status(200).json({message: "Logged out Successfully"});
}
