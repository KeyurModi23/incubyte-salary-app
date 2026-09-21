# Requirements Document: Employee Salary Management Software

## Goal
To build a scalable, performant, and intuitive web-based software application that allows the HR Manager of ACME org to manage salary data for 10,000 employees and answer analytical questions regarding how the organization pays its people.

## Persona
**HR Manager** at ACME org.
- Needs a clean, fast interface.
- Needs to manage large volumes of data (10k employees) without the browser freezing.
- Needs to extract insights on pay distribution.

## Scope & Features (In-Scope)
1. **Employee Roster & Salary View**: 
   - A highly performant data table (virtualized/paginated) to view all 10,000 employees.
   - Search functionality to find specific employees by name or ID.
2. **Salary Analytics Dashboard**:
   - Visualizations to answer "how the org pays people."
   - Metrics: Average salary by department, Average salary by country.
3. **Data Management (CRUD)**:
   - Ability to add a new employee's salary record.
   - Ability to update an existing employee's salary.
4. **Seed Script**:
   - Automated script to populate 10,000 mock employee records across multiple departments and countries for realistic testing.

## Out of Scope (and Why)
The following features are deliberately left out of this prototype to focus on core engineering fundamentals, high-performance data rendering, and speed of delivery within the assessment timeframe:

1. **Authentication & Authorization**: 
   - *Reasoning*: Implementing a secure login system (JWT, OAuth) adds significant boilerplate. For this prototype, we assume the user accessing the app is the authorized HR Manager.
2. **Historical Salary Tracking**: 
   - *Reasoning*: Tracking salary changes over time requires a complex temporal database schema. To keep the scope focused on current pay parity and performance, we will only track the *current* active salary of the employee.
3. **Multi-Currency Conversion Engine**:
   - *Reasoning*: While the prompt mentions "multiple countries," real-time FX rate conversion is complex. We will assume all salaries are normalized to a base currency (e.g., USD) for analytics, or we will store localized currency but only aggregate where appropriate.

## Technical Constraints & Standards
- **Backend**: Node.js, Express, TypeScript, PostgreSQL (via Prisma ORM).
- **Frontend**: React (Vite), TypeScript, Tailwind CSS, Shadcn UI.
- **Testing**: Test-Driven Development (TDD) using Jest/Vitest. All core logic must have fast, deterministic unit tests.
- **Performance**: The UI must handle 10k records gracefully using virtualization (`@tanstack/react-virtual`).
