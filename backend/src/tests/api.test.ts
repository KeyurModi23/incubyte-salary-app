import request from 'supertest';
import { describe, it, expect, afterAll } from 'vitest';
import app, { prisma } from '../app.js';

describe('HR Salary Management API', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('GET /api/employees should return a paginated list of employees', async () => {
    const res = await request(app).get('/api/employees?page=1&limit=10');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('meta');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeLessThanOrEqual(10);
    
    // Ensure it returns expected fields
    if (res.body.data.length > 0) {
      expect(res.body.data[0]).toHaveProperty('firstName');
      expect(res.body.data[0]).toHaveProperty('salary');
    }
  });

  it('GET /api/analytics should return aggregated salary data', async () => {
    const res = await request(app).get('/api/analytics');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('byDepartment');
    expect(res.body).toHaveProperty('byCountry');
    expect(Array.isArray(res.body.byDepartment)).toBe(true);
    expect(Array.isArray(res.body.byCountry)).toBe(true);
  });
});
