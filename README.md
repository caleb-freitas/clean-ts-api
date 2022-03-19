<h1 align="center">Satisfaction Survey</h1>

## Project

This project is temporarily paused.

This project allows satisfaction surveys to be carried out.

## How to execute

- Clone the repository
- Go to the folder that was cloned `cd clean-ts-api`
- Add the database credentials to `.env.example` file and rename it to just `.env`
- Add JWT secret key on file [env-example.ts](src/main/config/env-example.ts) and rename it to just `env.ts`
- Run `npm install` to install the dependencies
- Start a database on `localhost:5432`
- Run `npx prisma migrate dev` to create the tables on the database
- Run `npm run start` to start the server

The application will be available on `http://localhost:5050`

## Technologies

The project is being developed with the following technologies:

- [Node.js](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/pt-br/)
- [Prisma](https://www.prisma.io/)
- [Jest](https://jestjs.io/)
