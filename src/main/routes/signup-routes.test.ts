// eslint-disable-next-line import/no-extraneous-dependencies
import request from "supertest";

import { MongoHelper } from "../../infra/db/mongodb/helper/mongodb-helper";
import app from "../config/app";

describe("SignUp Routes", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

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
