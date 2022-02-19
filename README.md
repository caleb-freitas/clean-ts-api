<h1 align="center">Satisfaction Survey</h1>

## Project

In progress...

This project allows satisfaction surveys to be carried out.

## How to execute

Obs.: you need a running postgres database with the correct permissions inserted on the `.env` file to the migration command executes with success

- Clone the repository
- Go to the folder that was cloned `cd clean-ts-api`
- Run `npm install` to install the dependencies
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
