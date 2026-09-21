import { Router } from 'express';
import employeeRoutes from './employee.routes.js';

const router = Router();

router.use('/', employeeRoutes);

export default router;
