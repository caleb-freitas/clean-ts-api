// eslint-disable-next-line import/no-extraneous-dependencies
import request from "supertest";

import app from "../config/app";

describe("SignUp Routes", () => {
  test("should return account on succes", async () => {
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
