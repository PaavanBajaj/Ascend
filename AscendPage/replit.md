# Ascend Academics

## Overview

Ascend Academics is a tutoring services platform featuring a futuristic dark-themed landing page with royal purple accents. The application provides personalized tutoring services with a focus on academic excellence, CogAT test preparation, and one-on-one educational support. Built with React and Express, the platform uses InstantDB for real-time authentication and data management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript running on Vite for development and production builds.

**Routing**: Uses Wouter for lightweight client-side routing.

**UI Component System**: Built on shadcn/ui (New York style variant) with Radix UI primitives and Tailwind CSS for styling. The design system implements a dark mode-first approach with custom theming using CSS variables for colors and spacing.

**Design Philosophy**: System-based with a futuristic dark theme featuring royal purple accents (#6b46c1 to #7c3aed). The visual identity draws inspiration from modern SaaS platforms like Stripe and Linear, enhanced with sci-fi aesthetics including purple glow effects and glass-morphic elements.

**State Management**: TanStack Query (React Query) for server state management with custom query clients configured for API interactions.

**Form Handling**: React Hook Form with Zod resolvers for type-safe form validation.

**Typography**: Google Fonts integration (Space Grotesk, DM Sans, Geist Mono) for modern, futuristic typography.

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript.

**Build System**: Custom build script using esbuild for server bundling and Vite for client bundling. The build process bundles specific dependencies (allowlist approach) to reduce file system calls and improve cold start times.

**Storage Layer**: Abstracted storage interface (`IStorage`) with an in-memory implementation (`MemStorage`) as the default. The interface supports basic CRUD operations for users and is designed to be swappable with database-backed implementations.

**API Structure**: RESTful API with routes prefixed with `/api`. The routing system is set up for extension in `server/routes.ts`.

**Static File Serving**: Production builds serve the Vite-compiled React application from the `dist/public` directory with fallback to `index.html` for client-side routing support.

**Development Mode**: Vite middleware integration for hot module replacement (HMR) with custom error overlays and development tools (Replit-specific plugins for cartographer and dev banner).

### Database Schema

**ORM**: Drizzle ORM configured for PostgreSQL with schema definitions in TypeScript.

**Schema Definition**: Currently defines a `users` table with:
- `id`: UUID primary key (auto-generated)
- `username`: Unique text field
- `password`: Text field for authentication

**Validation**: Zod schemas generated from Drizzle schema for runtime type validation.

**Migrations**: Managed through Drizzle Kit with migrations stored in the `/migrations` directory.

**Design Decision**: The schema is minimal and extensible. While Drizzle is configured for PostgreSQL, the actual database integration is not yet fully implemented in the storage layer, allowing for flexibility in database choice.

### Authentication System

**Provider**: InstantDB authentication integrated on the client side.

**Flow**: Magic link/code-based authentication with multi-step signup process:
1. Email entry
2. Age verification
3. Code verification
4. Success confirmation

**Client Integration**: The `AuthModal` component handles the complete authentication flow with state management for login and signup modes.

**Session Management**: Managed by InstantDB with automatic user state synchronization through React hooks (`db.useAuth()`).

## External Dependencies

### Third-Party Services

**InstantDB**: Real-time database and authentication service (App ID: `6b5133f3-27f7-4e37-b46f-1bcbf1ebdd0c`). Handles user authentication, data synchronization, and real-time updates.

**Neon Database**: Serverless PostgreSQL configured via `@neondatabase/serverless` package for production database hosting (connection via `DATABASE_URL` environment variable).

### Key Libraries

**UI Components**: Radix UI primitives for accessible, unstyled components (@radix-ui/* packages).

**Styling**: Tailwind CSS with PostCSS processing, class-variance-authority for variant management, and clsx/tailwind-merge for conditional classes.

**Utilities**:
- date-fns: Date manipulation and formatting
- nanoid: Unique ID generation
- cmdk: Command menu interface
- lucide-react: Icon library

**Development Tools**:
- Replit-specific plugins for development experience (@replit/vite-plugin-*)
- TypeScript for type safety across the stack
- ESLint and Prettier for code quality (implied by project structure)

### Environment Requirements

**Required Environment Variables**:
- `DATABASE_URL`: PostgreSQL connection string for Drizzle ORM
- `NODE_ENV`: Environment mode (development/production)

**Build Requirements**: Node.js with ESNext module support, TypeScript compilation, and Vite bundling capabilities.