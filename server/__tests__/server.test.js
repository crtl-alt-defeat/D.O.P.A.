import app from "../app.js";
import client from "../db/client.js";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, test } from "vitest";
//todo: import authenticate from /server/db/queries/users

//user testing
let adminToken;
let firstUser;
const newUser = {
  name: "Test Tester",
  email: "test.account@gmail.com",
  password: "newTestPassword",
};
let testToken;

//type testing
const newType = {
  name: "test_type",
};
let firstType;

//goal testing
const newGoal = {
  name: "new_goal",
  type_id: 1,
};
let firstGoal;

//preprocessing
beforeAll(async () => {
  await client.connect();
  await client.query("BEGIN");

  const {
    rows: [user],
  } = await client.query("SELECT * FROM users");
  firstUser = user;

  const {
    rows: [type],
  } = await client.query("SELECT * FROM types");
  firstType = type;

  const {
    rows: [goal],
  } = await client.query("SELECT * FROM goals");
  firstGoal = goal;

  //todo: get admin token using authenticate (if we implement an admin role)
});

//post processing
afterAll(async () => {
  await client.query("ROLLBACK");
  await client.end();
});

//users tests
describe("users", () => {
  //register
  describe("POST /users/register", () => {
    it("creates a new user and sends back a token", async () => {
      const response = await request(app).post("/users/register").send(newUser);
      expect(response.status).toBe(201);
      expect(response.text).toMatch(/\w+\.\w+\.\w+/);
    });

    it("hashes the password of the created user", async () => {
      const {
        rows: [user],
      } = await client.query("SELECT password FROM users WHERE email = $1", [
        newUser.email,
      ]);
      expect(user).toBeDefined();
      expect(user.password).not.toBe("newTestPassword");
    });
  });

  //login
  describe("POST /users/login", () => {
    it("sends a token if the correct credentials are provided", async () => {
      const response = await request(app).post("/users/login").send({
        email: "test.account@gmail.com",
        password: "newTestPassword",
      });
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/\w+\.\w+\.\w+/);
      testToken = response.text;
    });

    it("sends 401 if incorrect credentials are provided", async () => {
      const response = await request(app).post("/users/login").send({
        email: "test.account@gmail.com",
        password: "wrongPassword",
      });
      expect(response.status).toBe(401);
    });
  });

  //get a user
  describe("GET /users/:id", () => {
    it("sends a user object if the correct id is given", async () => {
      const response = await request(app).get(`/users/${firstUser.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(firstUser);
    });

    //todo: sends a 401 if incorrect credentials are provided (if we make this api call only available to admins)
    it.skip("TODO: sends a 401 if incorrect credentials are provided", async () => {
      const response = await request(app)
        .get(`/users/1`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(response.status).toBe(401);
    });
  });

  //todo: we should be able to get the information of a user who is logged in
  describe("Get /users/me", () => {
    it("sends the requested user information", async () => {
      const response = await request(app)
        .get("/users/me")
        .set("Authorization", `Bearer ${testToken}`);
      expect(response.status).toBe(200);

      const user = response.body;
      expect(user).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: newUser.name,
          email: newUser.email,
          password: expect.any(String),
        }),
      );
    });

    it("sends 401 if the user is not logged in", async () => {
      const response = await request(app).get("/users/me");
      expect(response.status).toBe(401);
    });
  });

  //todo: we should be able to get types that a user has selected
  describe.todo("Get /users/me/types", () => {
    it("sends an array of types the user has selected", async () => {
      const response = await request(app)
        .get("/users/types")
        .set("Authorization", `Bearer ${testToken}`);
      expect(response.status).toBe(200);

      const types = response.body;
      expect(types).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
          }),
        ]),
      );
    });

    it("sends 401 if the user is not logged in", async () => {
      const response = await request(app).get("/users/types");
      expect(response.status).toBe(401);
    });
  });

  //todo: we should be able to get all goals the user has been given
  describe.todo("Get /users/me/goals", () => {
    it("sends an array of goals the user has been given", async () => {
      const response = await request(app)
        .get("/users/goals")
        .set("Authorization", `Bearer ${testToken}`);
      expect(response.status).toBe(200);

      const types = response.body;
      expect(types).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            type_id: expect.any(Number),
          }),
        ]),
      );
    });

    it("sends 401 if the user is not logged in", async () => {
      const response = await request(app).get("/users/goals");
      expect(response.status).toBe(401);
    });
  });

  //todo: we should be able to query goals for a specific date
  describe.todo("Get /users/me/goals/:date", () => {});
});

//types tests
describe("types", () => {
  describe("POST /types", () => {
    it("creates a new type and sends back an object of it", async () => {
      const response = await request(app).post("/types").send(newType);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: newType.name,
        }),
      );
    });

    it("seneds 400 if the request is missing required fields", async () => {
      const response = await request(app).post("/types").send({});
      expect(response.status).toBe(400);
    });

    //todo: sends 401 if incorrect credentials are provided (if we make this api call only available to admins)
    it.skip("sends a 401 if incorrect credentials are provided", async () => {
      const response = await request(app).post("/types").send(newType);
      expect(response.status).toBe(401);
    });
  });

  test("GET /types", async () => {
    const response = await request(app).get("/types");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
        }),
      ]),
    );
  });

  describe("GET /types/:id", () => {
    it("sends the type object if the correct id is given", async () => {
      const response = await request(app).get(`/types/${firstType.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(firstType);
    });

    it("sends 404 if the type doesnt exist", async () => {
      const response = await request(app).get("/types/0");
      expect(response.status).toBe(404);
    });
  });

  //todo: we should be able to get the goals of a specific type
  describe.todo("GET /types/:id/goals", () => {
    it.todo("sends a list of goals", async () => {});
    it.todo("sends 404 if the type doesnt exist", async () => {});
  });
});

//goals tests
describe("goals", () => {
  describe("POST /goals", () => {
    it("creates a new goal and sends back an object of it", async () => {
      const response = await request(app).post("/goals").send(newGoal);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: newGoal.name,
          type_id: newGoal.type_id,
        }),
      );
    });

    it("sends 400 if the goal is missing required fields", async () => {
      const response = await request(app).post("/goals").send({});
      expect(response.status).toBe(400);
    });

    //todo: sends 401 if incorrect credentials are provided (if we make this api call only available to admins)
    it.todo("sends 401 if incorrect credentials are provided", async () => {});
  });

  test("GET /goals", async () => {
    const response = await request(app).get("/goals");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          type_id: expect.any(Number),
        }),
      ]),
    );
  });

  describe("GET /goals/:id", () => {
    it("sends the goal object if the correct id is given", async () => {
      const response = await request(app).get(`/goals/${firstGoal.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(firstGoal);
    });

    it("sends 404 if the goal doesnt exist", async () => {
      const response = await request(app).get("/goals/0");
      expect(response.status).toBe(404);
    });
  });
});
