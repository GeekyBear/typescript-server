import { Request, response, Response } from 'express';
import User from '../db/models/User';
import Helper from '../helpers/Helper';
import PassHelper from '../helpers/PassHelper';
import { userInfo } from 'os';
import Role from '../db/models/Role';

const Register = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { name, email, roleId, password, confirmPassword } = req.body;

        const hashed = await PassHelper.PasswordHashing(password);

        const user = await User.create({
            name,
            email,
            password: hashed,
            active: true,
            verified: true,
            roleId
        });

        return res.status(201).send(Helper.ResponseData(201, 'User created', null, user));
    } catch (error: any) {
        return res.status(500).send(Helper.ResponseData(500, '', error, null));
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
            return res.status(401).send(Helper.ResponseData(401, 'Unauthorized', null, null));
        };

        const matched = await PassHelper.PasswordCompare(password, user.password);

        if (!matched) {
            return res.status(401).send(Helper.ResponseData(401, 'Unauthorized', null, null));
        }

        const dataUser = {
            name: user.name,
            email: user.email,
            roleId: user.roleId,
            verified: user.verified,
            active: user.active
        };

        console.log('dataUser', dataUser);

        // Generation of token and refreshToken
        const token = Helper.GenerateToken(dataUser);
        const refreshToken = Helper.GenerateRefreshToken(dataUser);

        // Updating the access token of the user
        user.accessToken = refreshToken;
        await user.save;

        // Saving the refresh token in local storage
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        // The user object to return
        const responseUser = {
            name: user.name,
            email: user.email,
            roleId: user.roleId,
            verified: user.verified,
            active: user.active,
            token: token
        }

        return res.status(200).send(Helper.ResponseData(200, 'OK', null, responseUser));

    } catch (error) {
        return res.status(500).send(Helper.ResponseData(500, '', error, null));
    }
}

const RefreshToken = async (req: Request, res: Response): Promise<Response> => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            return res.status(401).send(Helper.ResponseData(401, 'Unauthorized', null, null));
        }

        const decodedUser = Helper.ExtractRefreshToken(refreshToken);

        if (!decodedUser) {
            return res.status(401).send(Helper.ResponseData(401, 'Unauthorized', null, null));
        }

        const token = Helper.GenerateToken({
            name: decodedUser.name,
            email: decodedUser.email,
            roleId: decodedUser.roleId,
            verified: decodedUser.verified,
            active: decodedUser.active,
        });

        const resultUser = {
            name: decodedUser.name,
            email: decodedUser.email,
            roleId: decodedUser.roleId,
            verified: decodedUser.verified,
            active: decodedUser.active,
            token: token
        }

        return res.status(200).send(Helper.ResponseData(200, 'ok', null, resultUser));

    } catch (error) {
        return res.status(500).send(Helper.ResponseData(500, '', error, null));
    }
}

const UserDetail = async (req: Request, res: Response): Promise<Response> => {
    try {
        const email = res.locals.userEmail;
        const user = await User.findOne({
            where: {
                email
            }, include: {
                model: Role,
                attributes: ['id', 'roleName']
            }
        })

        if (!user) {
            return res.status(404).send(Helper.ResponseData(404, 'User not found', null, null));
        }

        user.password = '';
        user.accessToken = '';

        return res.status(200).send(Helper.ResponseData(200, 'OK', null, user));
    } catch (error) {
        return res.status(500).send(Helper.ResponseData(500, '', error, null));
    }
};

const UserLogout = async (req: Request, res: Response): Promise<Response> => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            return res.status(200).send(Helper.ResponseData(200, 'User logout', null, null));
        }

        const email = res.locals.userEmail;
        const user = await User.findOne({
            where: {
                email
            }
        })

        if (!user) {
            res.clearCookie('refreshToken');
            return res.status(200).send(Helper.ResponseData(200, 'User logout', null, null));
        }

        await user.update({ accessToken: null }, { where: { email: email } })
        res.clearCookie('refreshToken');

        return res.status(200).send(Helper.ResponseData(200, 'User logout', null, null));
    } catch (error) {
        return res.status(500).send(Helper.ResponseData(500, '', error, null));
    }
};

export default { Register, UserLogin, RefreshToken, UserDetail, UserLogout };