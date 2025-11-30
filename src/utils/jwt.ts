import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/env';
import { JWTPayload } from '../types';

export const generateToken = (payload: JWTPayload): string => {
    // @ts-ignore - expiresIn type mismatch with jsonwebtoken
    return jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn
    });
};

export const generateRefreshToken = (userId: string): string => {
    // @ts-ignore - expiresIn type mismatch with jsonwebtoken
    return jwt.sign({ id: userId }, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshExpiresIn
    });
};

export const verifyToken = (token: string): JWTPayload => {
    try {
        return jwt.verify(token, config.jwt.secret) as JWTPayload;
    } catch (error) {
        throw new Error('Invalid token');
    }
};

export const verifyRefreshToken = (token: string): { id: string } => {
    try {
        return jwt.verify(token, config.jwt.refreshSecret) as { id: string };
    } catch (error) {
        throw new Error('Invalid refresh token');
    }
};
