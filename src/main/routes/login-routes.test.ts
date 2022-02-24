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
          name: "caleb",
          email: "calebfreitas@tutanota.com",
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
          name: "caleb",
          email: "calebfreitas@tutanota.com",
          password,
        },
      });
      await request(app)
        .post("/api/login")
        .send({
          email: "calebfreitas@tutanota.com",
          password: "123456",
        })
        .expect(200);
    });
  });
});
