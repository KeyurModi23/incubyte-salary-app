import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  await prisma.employee.deleteMany();

  console.log('Generating 10,000 employees...');
  const employees = [];
  const departments = ['Engineering', 'HR', 'Finance', 'Marketing', 'Sales', 'Product', 'Customer Support'];
  const countries = ['USA', 'UK', 'India', 'Canada', 'Australia', 'Germany', 'Japan'];

  for (let i = 0; i < 10000; i++) {
    employees.push({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email() + i.toString(), // ensure uniqueness
      department: faker.helpers.arrayElement(departments),
      country: faker.helpers.arrayElement(countries),
      role: faker.person.jobTitle(),
      salary: faker.number.int({ min: 40000, max: 200000 }),
      currency: 'USD',
    });
  }

  console.log('Inserting into database (this will take a few seconds)...');
  // createMany is highly optimized for bulk inserts in PostgreSQL
  const result = await prisma.employee.createMany({
    data: employees,
    skipDuplicates: true,
  });

  console.log(`Successfully seeded ${result.count} employees.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
