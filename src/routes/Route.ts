import express from 'express';
import Authorization from '../middleware/Authorization';
import UserValidation from '../middleware/validation/UserValidation';
import RoleController from '../controllers/RoleController';
import UserController from '../controllers/UserController';
import MasterMenuController from '../controllers/MasterMenuController';

const router = express.Router();

// Role routing
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

// Master Menu Routing
router.post('/menu', Authorization.Authenticated, Authorization.AdminRole, MasterMenuController.CreateMenu);
router.get('/menu', Authorization.Authenticated, Authorization.AdminRole, MasterMenuController.GetListMenu);
router.get('/menu/all', Authorization.Authenticated, Authorization.SuperUser, MasterMenuController.GetAllMenu);
router.get('/menu/:id', Authorization.Authenticated, Authorization.AdminRole, MasterMenuController.GetDetailMenu);
router.patch('/menu/:id', Authorization.Authenticated, Authorization.AdminRole, MasterMenuController.UpdateMenu);
router.delete('/menu/:id', Authorization.Authenticated, Authorization.AdminRole, MasterMenuController.SoftDeleteMenu);
router.delete('/menu/permanent/:id', Authorization.Authenticated, Authorization.SuperUser, MasterMenuController.DeletePermanent);
export default router;
