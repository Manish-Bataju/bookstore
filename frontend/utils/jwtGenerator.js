import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    // we take the User ID to generate token..

    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d', // the user stays logged in for 30 days
    });
}

export default generateToken;