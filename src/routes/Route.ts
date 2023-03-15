import express from 'express';
import RoleController from '../controllers/RoleController';
import UserController from '../controllers/UserController';
import UserValidation from '../middleware/validation/UserValidation';

const router = express.Router();

router.get('/role', RoleController.GetRole);
router.get('/role/:id', RoleController.GetRoleById);
router.post('/role', RoleController.CreateRole);
router.patch('/role/:id', RoleController.UpdateRole);
router.delete('/role/:id', RoleController.DeleteRole);

// User Routing
router.post('/user/signup', UserValidation.RegisterValidation, UserController.Register);

export default router;