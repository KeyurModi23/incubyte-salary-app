import { Request, Response } from 'express';
import { EmployeeService } from '../services/employee.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const EmployeeController = {
  getEmployees: asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const search = req.query.search as string | undefined;

    const { employees, total } = await EmployeeService.getEmployees(page, limit, search);

    res.status(200).json(new ApiResponse(200, {
      data: employees,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }, "Employees fetched successfully"));
  }),

  createEmployee: asyncHandler(async (req: Request, res: Response) => {
    const { firstName, lastName, email, department, salary, country, role } = req.body;
    
    if (!firstName || !lastName || !email || !department || salary === undefined || !country || !role) {
      throw new ApiError(400, "Missing required fields");
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

    res.status(201).json(new ApiResponse(201, employee, "Employee created successfully"));
  }),

  updateEmployee: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { salary, department } = req.body;

    const employee = await EmployeeService.updateEmployee(id, {
      ...(salary !== undefined && { salary: Number(salary) }),
      ...(department && { department }),
    });

    res.status(200).json(new ApiResponse(200, employee, "Employee updated successfully"));
  }),

  getAnalytics: asyncHandler(async (req: Request, res: Response) => {
    const search = req.query.search as string | undefined;
    const analytics = await EmployeeService.getAnalytics(search);
    res.status(200).json(new ApiResponse(200, analytics, "Analytics fetched successfully"));
  })
};
