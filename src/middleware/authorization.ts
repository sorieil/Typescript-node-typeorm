import {Request, Response, NextFunction} from "express";

export const ensureAuthorized = (req: Request, res: Response, next: NextFunction) => {
    let bearerToken;
    let bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(' ');
        bearerToken = bearer[1];

        next();
    } else {
        bearerToken = null;
        res.send(403);
    }
};

export const ensureUser = (req: Request, res: Response, next: NextFunction) => {
    // req.
};

export const ensurePhotographer = (req: Request, res: Response, next: NextFunction) => {

};
