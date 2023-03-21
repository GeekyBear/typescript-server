import { Request, response, Response } from 'express';
import User from '../db/models/User';
import Helper from '../helpers/Helper';
import PassHelper from '../helpers/PassHelper';

const Register = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        const hashed = await PassHelper.PasswordHashing(password);

        const user = await User.create({
            name,
            email,
            password: hashed,
            active: true,
            verified: true,
            roleId: 1
        });

        return res.status(201).send(Helper.ResponseData(201, "User created", null, user));
    } catch (error: any) {
        return res.status(500).send(Helper.ResponseData(500, "", error, null));
    };
};

const UserLogin = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({
            where: {
                email
            }
        });

        if (!user) {
            return res.status(401).send(Helper.ResponseData(401, "Unauthorized", null, null));
        };

        const matched = await PassHelper.PasswordCompare(password, user.password);

        if (!matched) {
            return res.status(401).send(Helper.ResponseData(401, "Unauthorized", null, null));
        }

        const dataUser = {
            name: user.name,
            email: user.email,
            role: user.roleId,
            verified: user.verified,
            active: user.active
        };

        // Generation of token and refreshToken
        const token = Helper.GenerateToken(dataUser);
        const refreshToken = Helper.GenerateRefreshToken(dataUser);

        // Updating the access token of the user
        user.accessToken = refreshToken;
        await user.save;

        // Saving the refresh token in local storage
        res.cookie('refresh token', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        // The user object to return
        const responseUser = {
            name: user.name,
            email: user.email,
            role: user.roleId,
            verified: user.verified,
            active: user.active,
            token: token
        }

        return res.status(200).send(Helper.ResponseData(200, "OK", null, responseUser));

    } catch (error) {
        return res.status(500).send(Helper.ResponseData(500, "", error, null));
    }
}

export default { Register, UserLogin };