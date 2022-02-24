import request from "supertest";

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
});
