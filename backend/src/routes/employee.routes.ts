import { Router } from 'express';
import { EmployeeController } from '../controllers/employee.controller.js';

const router = Router();

router.get('/employees', EmployeeController.getEmployees);
router.post('/employees', EmployeeController.createEmployee);
router.put('/employees/:id', EmployeeController.updateEmployee);

router.get('/analytics', EmployeeController.getAnalytics);

export default router;
