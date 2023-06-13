import express from 'express';
import RoleController from '../controllers/RoleController';
import UserController from '../controllers/UserController';
import Authorization from '../middleware/Authorization';
import UserValidation from '../middleware/validation/UserValidation';

const router = express.Router();

router.get('/role', Authorization.Authenticated, Authorization.BasicUser, RoleController.GetRole);
router.post('/role', Authorization.Authenticated, Authorization.AdminRole, RoleController.CreateRole);
router.patch('/role/:id', Authorization.Authenticated, Authorization.AdminRole, RoleController.UpdateRole);
router.delete('/role/:id', Authorization.Authenticated, Authorization.SuperUser, RoleController.DeleteRole);
router.get('/role/:id', Authorization.Authenticated, Authorization.BasicUser, RoleController.GetRoleById);

// User Routing
router.post('/user/signup', UserValidation.RegisterValidation, UserController.Register);
router.post('/user/login', UserController.UserLogin);
router.get('/user/refresh-token', UserController.RefreshToken);
router.get('/user/current-user', Authorization.Authenticated, UserController.UserDetail);
router.get('/user/logout', Authorization.Authenticated, UserController.UserLogout);
export default router;
