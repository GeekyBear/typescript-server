import express from 'express';
import RoleController from '../controllers/RoleController';

const router = express.Router();

router.get('/role', RoleController.GetRole);
router.get('/role/:id', RoleController.GetRoleById);
router.post('/role', RoleController.CreateRole);
router.patch('/role/:id', RoleController.UpdateRole);
router.delete('/role/:id', RoleController.DeleteRole);

export default router;