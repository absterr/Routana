# Routana

<p style="text-align:center;">
  <img src="https://img.shields.io/badge/Bun-000000?logo=bun&logoColor=white" alt="Bun Badge"/>
  <img src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black" alt="React Badge"/>
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwind-css&logoColor=white" alt="TailwindCSS Badge"/>
  <img src="https://img.shields.io/badge/Shadcn-000000?logo=shadcn&logoColor=white" alt="Shadcn Badge"/>
  <img src="https://img.shields.io/badge/React_Router-CA4245?logo=react-router&logoColor=white" alt="React Router Badge"/>
  <img src="https://img.shields.io/badge/TanStack_Query-FF4154?logo=tanstack&logoColor=white" alt="TanStack React Query Badge"/>
  <img src="https://img.shields.io/badge/Zod-3066BE?logo=zod&logoColor=white" alt="Zod Badge"/>
</p>

<p style="text-align:center;">
  <img src="https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white" alt="Node.js Badge"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript Badge"/>
  <img src="https://img.shields.io/badge/Express-000000?logo=express&logoColor=white" alt="Express Badge"/>
  <img src="https://img.shields.io/badge/DrizzleORM-000000?logo=drizzle&logoColor=white" alt="DrizzleORM Badge"/>
  <img src="https://img.shields.io/badge/BetterAuth-000000?logo=better-auth&logoColor=white" alt="BetterAuth Badge"/>
  <img src="https://img.shields.io/badge/Resend-FF6A00?logo=maildotru&logoColor=white" alt="Resend Badge"/>
  <img src="https://img.shields.io/badge/Stripe-635BFF?logo=stripe&logoColor=white" alt="Stripe Badge"/>
</p>

**Routana** is a personalized learning and goal-oriented roadmap generator designed to help users create customized pathways for achieving their educational and professional objectives.

## Overview

Routana enables users to define personal goals, improve their current skills, and generate tailored roadmaps with step-by-step learning paths. The application leverages user input to recommend resources, milestones, and timelines, making it a valuable tool for self-directed learners, professionals seeking career advancement, or students pursuing specific competencies. By focusing on individual needs, Routana promotes efficient and motivated progress toward long-term goals.

## Features

- **Goal Setting**: Users can input specific goals, such as learning a new programming language or preparing for a certification, along with any required.
- **Roadmap Generation**: Automated creation of personalized roadmaps, including sequenced steps, recommended resources (e.g., articles, courses, videos), and estimated timelines.
- **Progress Tracking**: Tools to monitor advancement, mark completed milestones, and adjust goals accordingly.
- **Resource Recommendations**: Curated suggestions from reliable online platforms, integrated where possible.
- **Frequently asked questions**: Frequently asked questions related to the goal or field and their respective answers.

## Running the Project with Docker

To run the project locally with Docker:

1. Ensure Docker (or Docker Desktop) are installed on your system
2. Clone the repository (if not already done): `git clone https://github.com/absterr/Routana.git`
3. Navigate to the project directory: `cd Routana`
4. Build the Dockerimage: `docker build -t routana-local ./`
5. Run the container: `docker run -p 5000:5000 routana-local`
6. Access the application at `http://localhost:5000`

## Running the Project with Node.js and Bun

To run the project locally with a Javascript runtime:

1. Ensure you have Node.js and Bun installed on your system
2. Clone the repository: `git clone https://github.com/absterr/Routana.git`
3. Navigate to the project root directory: `cd Routana`
4. Navigate to the client directory: `cd client` and install dependencies: `bun install`
5. Once completed, navigate to the server directory: `cd ../server` and install dependencies: `npm install`
6. Configure server environment variables in a `.env.local` file. (All env variables are listed in `env.ts` file)
7. Compile the server code: `tsc` or compile on watch mode: `tsc -w`
8. Push the database models to your provided postgres database: `npm run push`
9. Start the development server: `npm run dev`
10. Navigate back to the client directory: `cd ../client`
11. Start the client server: `bun dev`
12. Access the application at `http://localhost:5173`

Routana is live and it can be accessed at: [Routana](https://routana.onrender.com).

## Dependencies

Routana relies on the key technologies and packages

The frontend utilizes the following dependencies:

- [Bun](https://bun.com/) - An all in one Javascript and Typescript runtime
- [React](https://react.dev/) - Javascript library for building the user interfaces
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework for styling javascript applications
- [Shadcn](https://ui.shadcn.com/) - Component library for building UI components
- [React router](https://reactrouter.com) - A library used for implementing client-side routing in react apps
- [Tanstack React query](https://tanstack.com/query/v5/docs/framework/react/overview) - A library for asynchronous state management, server state utilities and data fetching

The backend uitilizes the following dependencies:

- [Node.js](https://nodejs.org/) - Javascript runtime for building applications
- [Typescript](https://www.typescriptlang.org/) - A strongly typed superset of JavaScript with optional static type syntax
- [Express](https://expressjs.com/) - Javascript web framework for building web apps and API endpoints
- [DrizzleORM](https://orm.drizzle.team) - The fastest Typescript and Javascript ORM
- [Resend](https://resend.com) - Email API for developers
- [Stripe](https://docs.stripe.com) - Payment platform for businesses

These are dependencies utilized on both sides:

- [Better-auth](https://www.better-auth.com/) - Framework agnostic authentication framework for Javascript and Typescript applications
- [Zod](https://zod.dev/) - A Typescript-first validation library

(Refer to `package.json` in the client and server directories for the complete list of dependencies.)

## Contributing

Contributions are welcome to improve Routana. To contribute:

1. Fork the repository.
2. Create a new branch for your changes.
3. Implement features or fixes locally.
4. Submit a pull request with a clear description of changes.

Preferred contributions include bug fixes, new resource integrations, or UI improvements. Pull requests will be reviewed periodically. Please adhere to existing code style and include tests where applicable.

## Contributors

- [Abba Is'haq](https://github.com/absterr) – Primary developer

(Additional contributors will be listed here as the project grows.)

## Issues and improvements

Bugs, feature suggestions, or enhancements can be reported via GitHub Issues. For security vulnerabilities, please contact the maintainer directly via email.
