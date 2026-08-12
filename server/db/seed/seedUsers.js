import { faker } from "@faker-js/faker";
import { verifyToken } from "../../utils/jwt.js";
import { createUser } from "../queries/users.js";

export default async function seedUsers(num) {
  const users = [];
  for (let i = 0; i < num; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const newUser = {
      email: faker.internet.exampleEmail({
        firstName: firstName,
        lastName: lastName,
      }),
      password: faker.internet.password(),
      name: `${firstName} ${lastName}`,
    };
    const token = await createUser(newUser);
    users.push(verifyToken(token));
  }

  return users;
}
