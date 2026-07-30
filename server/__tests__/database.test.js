import client from "../db/client";
import { afterAll, beforeAll, describe, expect, test } from "vitest";

beforeAll(async () => {
  await client.connect();
});

afterAll(async () => {
  await client.end();
});

describe("Database schema", () => {
  test("users table is created with correct columns and constraints", async () => {
    const columns = await getColumns("users");
    expect(columns).toEqual(
      expect.arrayContaining([
        { column_name: "id", data_type: "integer", is_nullable: "NO" },
        { column_name: "email", data_type: "text", is_nullable: "NO" },
        { column_name: "password", data_type: "text", is_nullable: "NO" },
        { column_name: "name", data_type: "text", is_nullable: "NO" },
      ]),
    );

    const isEmailUnique = await isColumnConstrained("users", "email", "unique");
    expect(isEmailUnique).toBe(true);
  });

  test("types table is created with correct columns and constraints", async () => {
    const columns = await getColumns("types");
    expect(columns).toEqual(
      expect.arrayContaining([
        { column_name: "id", data_type: "integer", is_nullable: "NO" },
        { column_name: "name", data_type: "text", is_nullable: "NO" },
      ]),
    );

    const isNameUnique = await isColumnConstrained("types", "name", "unique");
    expect(isNameUnique).toBe(true);
  });

  test("goals table is created with correct columns and constraints", async () => {
    const columns = await getColumns("goals");
    expect(columns).toEqual(
      expect.arrayContaining([
        { column_name: "id", data_type: "integer", is_nullable: "NO" },
        { column_name: "name", data_type: "text", is_nullable: "NO" },
        { column_name: "type_id", data_type: "integer", is_nullable: "NO" },
      ]),
    );

    const isTypeIdForeignKey = await isColumnConstrained(
      "goals",
      "type_id",
      "foreign key",
    );
    expect(isTypeIdForeignKey).toBe(true);
  });

  test("users_goals table is created with correct columns and constraints", async () => {
    const columns = await getColumns("users_goals");
    expect(columns).toEqual(
      expect.arrayContaining([
        { column_name: "id", data_type: "integer", is_nullable: "NO" },
        { column_name: "user_id", data_type: "integer", is_nullable: "NO" },
        { column_name: "goal_id", data_type: "integer", is_nullable: "NO" },
        { column_name: "date_made", data_type: "date", is_nullable: "NO" },
        { column_name: "date_complete", data_type: "date", is_nullable: "YES" },
      ]),
    );

    const isUserIdForeignKey = await isColumnConstrained(
      "users_goals",
      "user_id",
      "foreign key",
    );
    expect(isUserIdForeignKey).toBe(true);

    const isGoalIdForeignKey = await isColumnConstrained(
      "users_goals",
      "goal_id",
      "foreign key",
    );
    expect(isGoalIdForeignKey).toBe(true);
  });

  test("users_types table is created with correct columns and constraints", async () => {
    const columns = await getColumns("users_types");
    expect(columns).toEqual(
      expect.arrayContaining([
        { column_name: "id", data_type: "integer", is_nullable: "NO" },
        { column_name: "user_id", data_type: "integer", is_nullable: "NO" },
        { column_name: "type_id", data_type: "integer", is_nullable: "NO" },
      ]),
    );

    const isUserIdForeignKey = await isColumnConstrained(
      "users_types",
      "user_id",
      "foreign key",
    );
    expect(isUserIdForeignKey).toBe(true);

    const isTypeIdForeignKey = await isColumnConstrained(
      "users_types",
      "type_id",
      "foreign key",
    );
    expect(isTypeIdForeignKey).toBe(true);
    //todo: check if user_id and type_id are mutually unique
  });
});

async function getColumns(table) {
  const sql = `
  SELECT column_name, data_type, is_nullable
  FROM information_schema.columns
  WHERE table_name = $1
  `;
  const { rows } = await client.query(sql, [table]);
  return rows;
}

async function isColumnConstrained(table, column, constraint) {
  const sql = `
  SELECT *
  FROM
    information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON kcu.constraint_name = tc.constraint_name
  WHERE
    tc.table_name = $1
    AND kcu.column_name = $2
    AND tc.constraint_type ilike $3
  `;
  const { rowCount } = await client.query(sql, [table, column, constraint]);
  return rowCount > 0;
}

//todo: create function to check mutual constraints; areColumnsMutuallyConstrained(table, columns[], constraint);
