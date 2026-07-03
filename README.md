# User Management Dashboard

A responsive React & JavaScript directory dashboard built with Tailwind CSS, Lucide React, and Framer Motion. It enables administrators to manage staff records integrated with the JSONPlaceholder REST API, featuring smart pagination, multi-field filters, full-text search, and deterministic sorting.

## Live Deployment Links

https://user-management-dashboard-ashy-ten.vercel.app/

## Key Features

Full CRUD Operations: Fetches entries from the JSONPlaceholder /users endpoint, validates forms for POST requests, pre-populates PUT modals, and handles DELETE confirmations.

Smart Pagination: Select from 10, 25, 50, or 100 users per page. Out-of-bound indexes are automatically clamped.

Advanced Floating Filters: A fly-out overlay processes records in real-time by First Name, Last Name, Email, and Department, backed by active query chips.

Universal Search: Instant, case-insensitive string matching across all user properties.

Deterministic Sorting: Interactive table headers toggle ascending/descending rules with visual indicator arrows.

Polished UI/UX: Features department-specific avatars, real-time analytics indicators, loading skeletons, responsive text layouts, and Framer Motion micro-animations.

Resilient Toast Notifications: Sliding alert blocks report layout feedback or service failures.


## Technical Stack

Core: React 19 + JavaScript (ES6+)

Build Tools: Vite 6 + @tailwindcss/vite

Styling: Tailwind CSS (Light-theme optimized)

Animation: Framer Motion (motion/react)

Icons: Lucide React (lucide-react)

Data Origin: JSONPlaceholder API

## Assumptions & Architectural Decisions

Dataset Hydration for Pagination Testing:
JSONPlaceholder only yields 10 initial entries. To properly test pagination boundaries, the initial list is mapped and appended with 95 additional realistic mock users on launch (totaling 105 entries).

Session Persistence Strategy:
Because the external API is read-only, custom IDs created mid-session are not retained on their database. To prevent server errors, the app runs actual PUT/DELETE requests for IDs 1-10, and simulates a 600ms network delay for IDs >10 while maintaining state changes in a local runtime array.

Resilient Network Fallbacks:
If the backend API fails to connect or encounters rate limits, the pipeline initializes a local backup user generator to keep the platform completely operational.
