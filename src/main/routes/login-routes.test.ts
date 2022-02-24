import { hash } from "bcrypt";
import request from "supertest";

import { prisma } from "../../infra/db/prisma/client/prisma-client";
import app from "../config/app";

describe("Login Routes", () => {
  describe("POST /api/signup", () => {
    test("should return 200 on signup", async () => {
      await request(app)
        .post("/api/signup")
        .send({
          name: "user",
          email: "user@mail.com",
          password: "123456",
          passwordConfirmation: "123456",
        })
        .expect(200);
    });
  });

  describe("POST /api/login", () => {
    test("should return 200 on login", async () => {
      const password = await hash("123456", 12);
      await prisma.accounts.create({
        data: {
          name: "user",
          email: "user@mail.com",
          password,
        },
      });
      await request(app)
        .post("/api/login")
        .send({
          email: "user@mail.com",
          password: "123456",
        })
        .expect(200);
    });

    test("should return 401 on login", async () => {
      await request(app)
        .post("/api/login")
        .send({
          email: "invalid_user@mail.com",
          password: "123456",
        })
        .expect(401);
    });
  });
});
