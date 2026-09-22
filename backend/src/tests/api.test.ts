import request from 'supertest';
import { describe, it, expect, afterAll, beforeAll } from 'vitest';
import app from '../app.js';
import { prisma } from '../lib/prisma.js';

describe('HR Salary Management API', { timeout: 30000 }, () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('GET /api/employees should return a paginated list of employees', async () => {
    const res = await request(app).get('/api/employees?page=1&limit=10');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('meta');
    expect(Array.isArray(res.body.data.data)).toBe(true);
    expect(res.body.data.data.length).toBeLessThanOrEqual(10);
    
    // Ensure it returns expected fields
    if (res.body.data.data.length > 0) {
      expect(res.body.data.data[0]).toHaveProperty('firstName');
      expect(res.body.data.data[0]).toHaveProperty('salary');
    }
  });

  it('GET /api/analytics should return aggregated salary data', async () => {
    const res = await request(app).get('/api/analytics');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('byDepartment');
    expect(res.body.data).toHaveProperty('byCountry');
    expect(Array.isArray(res.body.data.byDepartment)).toBe(true);
    expect(Array.isArray(res.body.data.byCountry)).toBe(true);
  });

  describe('GET /api/employees with search', () => {
    it('should filter employees by search query', async () => {
      // Assuming we seeded some employees, let's just search for a common letter like 'a'
      const response = await request(app).get('/api/employees?search=a&limit=5');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data.data)).toBe(true);
      if (response.body.data.data.length > 0) {
        // Just verify the shape
        expect(response.body.data.data[0]).toHaveProperty('firstName');
      }
    });
  });

  describe('POST /api/employees', () => {
    it('should create a new employee and return 201', async () => {
      const newEmployee = {
        firstName: 'JaneTest',
        lastName: 'DoeTest',
        email: `jane${Date.now()}@example.com`,
        department: 'Engineering',
        salary: 150000,
        country: 'USA',
        role: 'Developer'
      };

      const response = await request(app)
        .post('/api/employees')
        .send(newEmployee);
        
      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.firstName).toBe('JaneTest');
    });

    it('should return 400 if required fields are missing', async () => {
      const invalidEmployee = { firstName: 'Jane' }; // Missing everything else
      const response = await request(app)
        .post('/api/employees')
        .send(invalidEmployee);
        
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Missing required fields');
    });
  });

  describe('PUT /api/employees/:id', () => {
    it('should update an existing employee and return 200', async () => {
      // First create one to update
      const newEmployee = await prisma.employee.create({
        data: {
          firstName: 'UpdateTest',
          lastName: 'User',
          email: `update${Date.now()}@example.com`,
          department: 'HR',
          salary: 50000,
          country: 'UK',
          role: 'Manager'
        }
      });

      const updateData = { salary: 60000, department: 'Management' };
      
      const response = await request(app)
        .put(`/api/employees/${newEmployee.id}`)
        .send(updateData);
        
      expect(response.status).toBe(200);
      expect(response.body.data.salary).toBe(60000);
      expect(response.body.data.department).toBe('Management');
    });
  });
});
