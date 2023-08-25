import { Request, Response, NextFunction } from 'express';
import { db } from '../util/db';
import { Model } from 'sequelize';


const Visitor = db.visitor;

const visitorTrackerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const ipAddress = req.ip; // Get the visitor's IP address
    const userAgent = req.get('User-Agent'); // Get the visitor's user agent
    const timestamp = new Date();
    const route = req.url.substring(0, 249);; // Get the current route

    // console.log(req);
    try {
        await Visitor.create({ ipAddress, userAgent, route, timestamp });
    } catch (error) {
        console.error('Error saving visitor:', error);
    }

    next();
};



export default visitorTrackerMiddleware;