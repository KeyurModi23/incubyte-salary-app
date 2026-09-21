import { prisma } from '../lib/prisma.js';

export const EmployeeService = {
  getEmployees: async (page: number, limit: number, search?: string) => {
    const skip = (page - 1) * limit;

    const where = search ? {
      OR: [
        { firstName: { contains: search, mode: 'insensitive' as const } },
        { lastName: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
        { department: { contains: search, mode: 'insensitive' as const } },
      ]
    } : {};

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.employee.count({ where }),
    ]);

    return { employees, total };
  },

  createEmployee: async (data: {
    firstName: string;
    lastName: string;
    email: string;
    department: string;
    salary: number;
    country: string;
    role: string;
  }) => {
    return await prisma.employee.create({
      data,
    });
  },

  updateEmployee: async (id: string, data: { salary?: number; department?: string }) => {
    return await prisma.employee.update({
      where: { id },
      data,
    });
  },

  getAnalytics: async (search?: string) => {
    const where = search ? {
      OR: [
        { firstName: { contains: search, mode: 'insensitive' as const } },
        { lastName: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
        { department: { contains: search, mode: 'insensitive' as const } },
      ]
    } : {};

    const [departmentData, countryData] = await Promise.all([
      prisma.employee.groupBy({
        by: ['department'],
        where,
        _avg: { salary: true },
        _count: { _all: true },
        orderBy: { _avg: { salary: 'desc' } }
      }),
      prisma.employee.groupBy({
        by: ['country'],
        where,
        _avg: { salary: true },
        _count: { _all: true }
      })
    ]);

    // Sort country data by count descending in JS to avoid Prisma orderBy _all validation error
    countryData.sort((a, b) => b._count._all - a._count._all);

    // Format to match the previous raw query response expected by frontend
    return {
      byDepartment: departmentData.map(d => ({
        department: d.department,
        avgSalary: d._avg.salary || 0,
        count: d._count._all
      })),
      byCountry: countryData.map(c => ({
        country: c.country,
        avgSalary: c._avg.salary || 0,
        count: c._count._all
      }))
    };
  }
};
