import { Request, Response, NextFunction } from 'express';
import { db } from '../util/db';
import bcrypt from 'bcrypt';
import { Model } from 'sequelize';

interface ApiKeyAttributes {
    id: number;
    key: string;
    is_active: boolean;
}

interface ApiKeyInstance extends Model<ApiKeyAttributes>, ApiKeyAttributes { }

const ApiKey = db.apiKey;

const apiKeyAuth = async (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.header('X-API-KEY');

    // console.log(req.body, apiKey);

    if (!apiKey) {
        return res.status(401).json({ error: 'API key not provided' });
    }

    try {
        const apiKeyData = await ApiKey.findOne({ where: { is_active: true } });
        // console.log(apiKeyData);
        if (!apiKeyData) {
            return res.status(401).json({ error: 'Invalid API key' });
        }

        const isValid = await bcrypt.compare(apiKey, apiKeyData.key);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid API key' });
        }

        next();

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Server error' });
    }
};

export default apiKeyAuth;
