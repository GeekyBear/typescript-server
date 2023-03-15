import Validator from "validatorjs";
import { Request, Response, NextFunction } from 'express';
import Helper from "../../helpers/Helper";
import User from "../../db/models/User";

const RegisterValidation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        const data = {
            name,
            email,
            password,
            confirmPassword
        };

        // Rules for validation
        const rules: Validator.Rules = {
            "name": "required|string|max:50",
            "email": "required|email",
            "password": "required|min:8",
            "confirmPassword": "required|same:password"
        };

        // Validate user
        const validator = new Validator(data, rules);
        if (validator.fails()) {
            return res.status(400).send(Helper.ResponseData(400, "Bad request", validator.errors, null));
        };

        // Check if email was already registered
        const user = await User.findOne({
            where: {
                email: data.email
            }
        });

        if (user) {
            const errorData = {
                errors: {
                    email: ["Email already registered"]
                }
            };

            return res.status(400).send(Helper.ResponseData(400, "Bad Request", errorData, null));
        };

        next();
    } catch (error: any) {
        return res.status(500).send(Helper.ResponseData(500, "", error, null));
    };
};
export default { RegisterValidation };