import { NextFunction, Request, Response, Router } from "express";

interface IRequest extends Request {
    token?: string;
}
export const ensureAuth = (req: IRequest, res: Response, next: NextFunction) => {
    // get value from authorization header
    // const bearerHeader = req.headers["authorization"];

    // if (typeof bearerHeader !== "undefined") {
    //     // Verify the token
    //     const bearer = (<string>bearerHeader).split(" ")[1];
    //     jwt.verify(<string>bearer, <string>process.env.JWT_SECRET, (err, authData) => {
    //         // Throw err status if unauthorized
    //         if (err) res.sendStatus(403);
    //         else {
    //             // Allow access the route if everything is fine
    //             next();
    //         }
    //     });
    // } else {
    //     // Forbidden
    //     res.sendStatus(403);
    // }
};
