import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// GET /api/employees
app.get('/api/employees', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.employee.count(),
    ]);

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
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// GET /api/analytics
app.get('/api/analytics', async (req, res) => {
  try {
    const byDepartment = await prisma.employee.groupBy({
      by: ['department'],
      _avg: { salary: true },
      _count: { id: true },
    });

    const byCountry = await prisma.employee.groupBy({
      by: ['country'],
      _avg: { salary: true },
      _count: { id: true },
    });

    res.json({
      byDepartment: byDepartment.map(d => ({
        department: d.department,
        avgSalary: d._avg.salary,
        count: d._count.id
      })),
      byCountry: byCountry.map(c => ({
        country: c.country,
        avgSalary: c._avg.salary,
        count: c._count.id
      })),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default app;
