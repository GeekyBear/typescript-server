import Validator from "validatorjs";
import { Request, Response, NextFunction } from 'express';
import Helper from "../../helpers/Helper";

const CreateMenuValidation = async (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (error) {
        return res.status(500).send(Helper.ResponseData(500, "", error, null));
    }
}