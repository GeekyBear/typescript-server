import { Request, Response, NextFunction } from "express";
import Helper from "../helpers/Helper";

const Authenticated = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authToken = req.headers["authorization"];
        const token = authToken && authToken.split(" ")[1];

        if (token === null) {
            return res.status(401).send(Helper.ResponseData(401, "Unauthorized", null, null));
        };

        const result = Helper.ExtractToken(token!);

        if (!result) {
            return res.status(401).send(Helper.ResponseData(401, "Unauthorized", null, null));
        }

        res.locals.userEmail = result?.email;

        res.locals.roleId = result?.roleId;

        next();


    } catch (error: any) {
        return res.status(500).send(Helper.ResponseData(500, "", error, null));
    }
}

const SuperUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        const roleId = parseInt(res.locals.roleId);

        if (roleId !== 1) {
            return res.status(401).send(Helper.ResponseData(403, "Forbidden", null, null));
        }

        next();
    } catch (error: any) {
        return res.status(500).send(Helper.ResponseData(500, "", error, null));
    }
};

const AdminRole = (req: Request, res: Response, next: NextFunction) => {
    try {
        const roleId = parseInt(res.locals.roleId);

        if (roleId !== 2) {
            return res.status(401).send(Helper.ResponseData(403, "Forbidden", null, null));
        }

        next();
    } catch (error: any) {
        return res.status(500).send(Helper.ResponseData(500, "", error, null));
    }
};

const BasicUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        const roleId = parseInt(res.locals.roleId);

        if (roleId !== 3) {
            return res.status(401).send(Helper.ResponseData(403, "Forbidden", null, null));
        }

        next();
    } catch (error: any) {
        return res.status(500).send(Helper.ResponseData(500, "", error, null));
    }
};

export default { Authenticated, SuperUser, AdminRole, BasicUser };