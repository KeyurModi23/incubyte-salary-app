# Performance & Architecture Trade-offs

This document outlines the key engineering decisions, performance considerations, and technical trade-offs made while building the Employee Salary Management Software.

## 1. High-Performance Data Rendering (Frontend)
**The Problem:** Rendering 10,000 DOM elements simultaneously in React will freeze the browser, drastically consume memory, and create an unusable experience for the HR Manager.
**The Solution:** 
- We implemented **Virtualization** using `@tanstack/react-virtual`. Instead of rendering 10,000 table rows, we only render the ~15 rows currently visible in the viewport. 
- We coupled virtualization with **Infinite Scrolling API Pagination**. The frontend only loads the first 50 records initially (14 KB payload instead of a 3.5 MB payload). As the user scrolls to the bottom of the virtualized list, it fetches the next 50 records in the background and appends them.
**The Trade-off:** Virtualization requires strict DOM height measurements. This slightly increases the complexity of the React component and test environment (requiring layout engine mocks in JSDOM) but provides a flawless, native-feeling scroll experience at any data volume.

## 2. API Architecture (Backend)
**The Problem:** Repetitive error handling (`try/catch`) and inconsistent JSON response formatting across different backend endpoints.
**The Solution:** 
- Implemented a standardized `ApiResponse` and `ApiError` class.
- Built a global `asyncHandler` wrapper that catches all promise rejections and forwards them to a central Express Error Middleware.
**The Trade-off:** It creates a tiny bit of abstraction overhead for new developers learning the codebase, but guarantees 100% consistency in JSON payloads (`{ success, message, data }`), eliminating boilerplate and massively speeding up feature delivery.

## 3. Database Schema & ORM
**The Problem:** Managing complex SQL queries and ensuring type safety between the database and the backend.
**The Solution:** We used PostgreSQL heavily paired with Prisma ORM. 
- Prisma provides auto-generated TypeScript types that perfectly match the schema, completely preventing runtime mismatch errors.
- We deliberately omitted a complex temporal database schema (storing historical salaries) to keep the prototype focused on current pay distribution, as noted in the Requirements document.
**The Trade-off:** Prisma has a slightly larger memory footprint than a raw SQL query builder (like Kysely), but the developer velocity and strict type-safety significantly outweigh this cost for a standard CRUD analytics dashboard.

## 4. UI/UX Design
**The Problem:** The HR Manager needs an intuitive way to parse thousands of salary records. Standard tables are often cramped on mobile or smaller laptops.
**The Solution:** We bypassed standard HTML `<table>` tags and used a CSS Grid-based layout with a custom scrollbar. In mobile views, the data collapses into a vertical card-based layout.
**The Trade-off:** A custom CSS grid table is harder to implement accessibly than a native `<table>` element, requiring strict attention to ARIA roles. However, it allowed for much greater responsive design flexibility.
