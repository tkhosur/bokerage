import jwt from 'jsonwebtoken'

export const shouldBeLoggedIn = (req, res) => {
    console.log("userid",req.userId);
    res.status(200).json({ messsage: 'You are Authenticated.' });
}

export const shouldBeAdmin = (req, res) => {
    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json({ messsage: 'Not Authenticated...' });
    } 

    jwt.verify(token, process.env.JWT_SECRET_KEY, async(err, payload) => {
        if(err) {
            res.status(403).json({ messsage: 'Token is not valid!...' });
        }

        if(!payload.isAdmin) {
            res.status(403).json({ messsage: 'Not Authorized!...' })
        }
    });

    res.status(200).json({ messsage: 'You are Authenticated.' });
}