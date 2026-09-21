import { Request, Response } from 'express';
import { EmployeeService } from '../services/employee.service.js';

export const EmployeeController = {
  getEmployees: async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const search = req.query.search as string | undefined;

      const { employees, total } = await EmployeeService.getEmployees(page, limit, search);

      res.json({
        data: employees,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch employees' });
    }
  },

  createEmployee: async (req: Request, res: Response) => {
    try {
      const { firstName, lastName, email, department, salary, country, role } = req.body;
      
      if (!firstName || !lastName || !email || !department || salary === undefined || !country || !role) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const employee = await EmployeeService.createEmployee({
        firstName,
        lastName,
        email,
        department,
        salary: Number(salary),
        country,
        role,
      });

      res.status(201).json(employee);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create employee' });
    }
  },

  updateEmployee: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const { salary, department } = req.body;

      const employee = await EmployeeService.updateEmployee(id, {
        ...(salary !== undefined && { salary: Number(salary) }),
        ...(department && { department }),
      });

      res.json(employee);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update employee' });
    }
  },

  getAnalytics: async (req: Request, res: Response) => {
    try {
      const search = req.query.search as string | undefined;
      const analytics = await EmployeeService.getAnalytics(search);
      res.json(analytics);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  }
};
