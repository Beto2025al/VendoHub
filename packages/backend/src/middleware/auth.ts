import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const secretKey = process.env.JWT_SECRET || 'your-secret-key';
const tokenExpiration = '1h'; // Token expiry duration

// Token verification middleware
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).send('No token provided.');

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.status(401).send('Unauthorized.');
        req.userId = decoded.id;
        next();
    });
};

// Role-based access control middleware
export const authorizeRoles = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.userId) return res.status(403).send('User not authorized.');
        const userRole = req.userRole; // Assuming user role is set in req object
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).send('Access denied.');
        }
        next();
    };
};

// User session management and token refresh
export const refreshToken = (req: Request, res: Response) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) return res.status(403).send('Refresh token not provided.');

    jwt.verify(refreshToken, secretKey, (err, decoded) => {
        if (err) return res.status(403).send('Invalid refresh token.');

        const newToken = jwt.sign({ id: decoded.id, role: decoded.role }, secretKey, { expiresIn: tokenExpiration });
        res.json({ token: newToken });
    });
};

export default { verifyToken, authorizeRoles, refreshToken };