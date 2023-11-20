import { JWT_SECRET } from '$env/static/private';
import jwt from 'jsonwebtoken';

export enum IJwtObjectType {
	USER,
	BOT
}

interface JwtPayload {
	objectId: string;
	objectType: IJwtObjectType;
}

// Create JWT token
export function createJwtToken(objectId: string, objectType: IJwtObjectType) {
	return jwt.sign(
		{
			objectId,
			objectType
		} as JwtPayload,
		JWT_SECRET,
		{
			expiresIn: '300d'
		}
	);
}

// decode JWT token
export function decodeJwtToken(token: string) {
	try {
		return jwt.verify(token, JWT_SECRET) as JwtPayload;
	} catch (err) {
		return null;
	}
}
