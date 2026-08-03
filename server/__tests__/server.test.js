import app from "../app.js";
import client from "../db/client.js";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, test } from "vitest";

let token;
let lastProduct;
let orderedProduct;

beforeAll(async () => {
  await client.connect();
  await client.query("BEGIN");
});

afterAll(async () => {
  await client.query("ROLLBACK");
  await client.end();
});

describe("users", () => {
  describe("POST /users/register", () => {
    it("creates a new user and sends back a token", async () => {
      //placeholder test
      expect(0).toBe(1);
    });

    it("hashes the password of the created user", async () => {
      //placeholder test
      expect(0).toBe(1);
    });
  });

  describe("POST /users/login", () => {
    it("sends a token if the correct credentials are provided", async () => {
      //placeholder test
      expect(0).toBe(1);
    });

    it("sends 401 if incorrect credentials are provided", async () => {
      //placeholder test
      expect(0).toBe(1);
    });
  });

  describe("GET /users/:id", () => {
    it("sends a user object if the correct id is given", async () => {
      //placeholder test
      expect(0).toBe(1);
    });

    //todo: sneds a 401 if incorrect credentials are provided (if we make this api call only available to admins)
    it.todo("sends a 401 if incorrect credentials are provided", async () => {
      //placeholder test
      expect(0).toBe(1);
    });
  });

  //todo: create new get calls
  describe.todo("Get /users/me", () => {});
  describe.todo("Get /users/me/types", () => {});
  describe.todo("Get /users/me/goals", () => {});
});

describe("types", () => {
  describe("POST /types", () => {
    it("creates a new type and sends back an object of it", async () => {
      //placeholder test
      expect(0).toBe(1);
    });

    //todo: sends 401 if incorrect credentials are provided (if we make this api call only available to admins)
    it.skip("sends a 401 if incorrect credentials are provided", async () => {
      //placeholder test
      expect(0).toBe(1);
    });
  });

  test("GET /types", async () => {
    //placeholder test
    expect(0).toBe(1);
  });

  describe("GET /types/:id", () => {
    it("sends the type object if the correct id is given", async () => {
      //placeholder test
      expect(0).toBe(1);
    });

    it("sends 404 if the type doesnt exist", async () => {
      //placeholder test
      expect(0).toBe(1);
    });
  });

  describe("GET /types/:id/goals", () => {
    it("sends a list of goals", async () => {
      //placeholder test
      expect(0).toBe(1);
    });

    it("sends 404 if the type doesnt exist", async () => {
      //placeholder test
      expect(0).toBe(1);
    });
  });
});

describe("goals", () => {
  describe("POST /goals", () => {
    it("creates a new goal and sends back an object of it", async () => {
      //placeholder test
      expect(0).toBe(1);
    });

    //todo: sends 401 if incorrect credentials are provided (if we make this api call only available to admins)
    it.skip("sends 401 if incorrect credentials are provided", async () => {
      //placeholder test
      expect(0).toBe(1);
    });
  });

  test("GET /goals", async () => {
    //placeholder test
    expect(0).toBe(1);
  });

  describe("GET /goals/:id", () => {
    it("sends a goal object if the id is correct", async () => {
      //placeholder test
      expect(0).toBe(1);
    });

    it("sends 404 if the goal doesnt exist", async () => {
      //placeholder test
      expect(0).toBe(1);
    });
  });
});
