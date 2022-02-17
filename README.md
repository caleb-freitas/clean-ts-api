<h1 align="center">Satisfaction Survey</h1>

## Project

In progres...

This project allows satisfaction surveys to be carried out.

## How to execute

- Clone the repository
- Go to the folder that was cloned `cd clean-ts-api`
- Run `npm install` to install the dependencies
- Run `npx prisma migrate dev` to create the tables on the database
- Run `npm run start` to start the server

Obs.: you need a running postgres database with the correct permitions inserted on the .env file to the migration commad executes with success

The application will be available on `http://localhost:5050`

## Technologies

The project is being developed with the following technologies:

- [Node.js](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/pt-br/)
- [Prisma](https://www.prisma.io/)
- [Jest](https://jestjs.io/)
