# AI Workflow & Prompts

*This document tracks the usage of AI tools (like Claude/Antigravity) during the development of this project, demonstrating intentional use of AI to accelerate development while maintaining engineering quality.*

## Phase 1: Planning & Setup
- **Prompt:** "Extract the requirements from the provided `.docx` file and create a comprehensive strategy guide for building a React/Node/Postgres salary management app for 10k employees."
- **AI Value:** Quickly extracted constraints, identified the need for data virtualization on the frontend, and drafted the initial project architecture.

## Phase 2: Refactoring & Architecture
- **Prompt:** "Please follow proper coding standards, make code proper structured in backend as well as frontend, in backend please follow controllers, services, routes structure."
- **AI Value:** Refactored the monolithic Express application into a scalable MVC architecture (`routes/`, `controllers/`, `services/`), resolving Prisma connection pooling limits via a singleton implementation.

## Phase 3: SaaS UI Transformation
- **Prompt:** "Didn't you think design is too basic, it should be designed like a saas type of product, which looks good also and it should be smooth and proper also, as i want to make proper user experience..."
- **AI Value:** Completely overhauled the frontend styling. Implemented dark mode, sleek cards, dynamic layout adjustments, and sticky headers using Shadcn UI and Tailwind CSS best practices.

## Phase 4: Bug Fixing & Performance Optimization
- **Prompt:** "Search bar is not working properly, also can you check is there any process running by youb as i have to click 2 times send button"
- **AI Value:** Diagnosed a stuck Node process causing massive CPU lag. Split the heavy database grouping query (`fetchAnalytics`) away from the search bar's live filter to prevent event-loop blocking, then updated the `getAnalytics` controller to use Prisma's `groupBy` for hyper-efficient filtered aggregation.
