import jwt from 'jsonwebtoken';
import { sendErrorResponse } from '../utils/sendResponse.js';

let { JWT_SECRET } = process.env;

export default async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return sendErrorResponse(res, 401, 'Authentication required');
        }

        if (!JWT_SECRET) {
            return sendErrorResponse(res, 401, 'Missing JWT_SECRET env var. Set it and restart the server');
        }

        const bearerToken = req.headers.authorization.split(' ')[1] || req.headers.authorization;

        jwt.verify(bearerToken, JWT_SECRET, { issuer: 'https://www.netguru.com/' }, function(e, decoded) {
            if (e) {
                return sendErrorResponse(res, 401, e?.message?.toString());
            }
            req.userData = decoded;
        });

        if (!req.userData) {
            return sendErrorResponse(res, 401, 'Authentication Failed');
        }

        next();
    } catch (e) {
        return sendErrorResponse(res, 401, 'Authentication Failed', e);
    }
};
