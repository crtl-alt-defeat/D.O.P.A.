import { writeFile, appendFile } from "fs/promises";
import { faker } from "@faker-js/faker";
import { verifyToken } from "../utils/jwt.js";

//database queries
import { createUser } from "./queries/users.js";
import { createType } from "./queries/types.js";
import { createGoal } from "./queries/goals.js";
import { createUserType } from "./queries/usersTypes.js";
import { createUserGoal } from "./queries/usersGoals.js";

//auxiliary function: checks if seeding function should log its results
function shouldLog() {
  //if environment variable doesnt exist: don't log
  if (!process.env.LOG_SEED) return false;
  //if environment variable is equal to 'true': log
  return process.env.LOG_SEED == "true";
}

//seed tables
export default async function seed() {
  if (shouldLog()) {
    //create log file
    try {
      await writeFile("fake_user_info.txt", "", "utf8");
    } catch (e) {
      console.error("Error creating log file:", e.message);
    }
  }

  // seed users table
  const users = [];
  for (let i = 0; i < 5; i++) {
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

    if (shouldLog()) {
      //add user info to log file
      try {
        const lineBreak = i != 0 ? "\n" : "";
        const fileText = `name: ${newUser.name}\nemail: ${newUser.email}\npass: ${newUser.password}\n`;
        await appendFile("fake_user_info.txt", lineBreak + fileText, "utf8");
      } catch (e) {
        console.error("Error writing to log file:", e.message);
      }
    }
  }

  // seed types table
  const types = [];
  types.push(await createType("self care"));
  types.push(await createType("household"));
  types.push(await createType("work/school"));
  types.push(await createType("relationship"));

  // seed goals table
  const goals = [];
  goals.push(
    await createGoal({
      name: "brush teeth",
      type_id: types[0].id,
    }),
  );
  goals.push(
    await createGoal({
      name: "take meds",
      type_id: types[0].id,
    }),
  );
  goals.push(
    await createGoal({
      name: "take a shower",
      type_id: types[0].id,
    }),
  );
  goals.push(
    await createGoal({
      name: "exercise",
      type_id: types[1].id,
    }),
  );
  goals.push(
    await createGoal({
      name: "touch grass",
      type_id: types[1].id,
    }),
  );

  goals.push(
    await createGoal({
      name: "do laundry",
      type_id: types[1].id,
    }),
  );
  goals.push(
    await createGoal({
      name: "clean room (min. 4 items)",
      type_id: types[1].id,
    }),
  );
  goals.push(
    await createGoal({
      name: "get groceries",
      type_id: types[1].id,
    }),
  );
  goals.push(
    await createGoal({
      name: "do dishes",
      type_id: types[1].id,
    }),
  );

  goals.push(
    await createGoal({
      name: "check email",
      type_id: types[2].id,
    }),
  );
  goals.push(
    await createGoal({
      name: "work on deadlines",
      type_id: types[2].id,
    }),
  );
  goals.push(
    await createGoal({
      name: "make a task list",
      type_id: types[2].id,
    }),
  );
  goals.push(
    await createGoal({
      name: "prepare outfit for tomorrow",
      type_id: types[2].id,
    }),
  );

  goals.push(
    await createGoal({
      name: "Kiss your significant other",
      type_id: types[3].id,
    }),
  );
  goals.push(
    await createGoal({
      name: "Text a friend/fam",
      type_id: types[3].id,
    }),
  );
  goals.push(
    await createGoal({
      name: "make plans with someone",
      type_id: types[3].id,
    }),
  );

  //deadline goals
  //goals.push(await createGoal("birthday reminder", types[3].id));
  //goals.push(await createGoal("appointment reminder", types[3].id));

  // seed users_types table
  const usersTypes = [];
  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    //add a random number of desired goal types to a user
    let numTypes = Math.ceil(Math.random() * types.length);
    for (let j = 0; j < numTypes; j++) {
      //only add new types to the user
      let foundUnique = false;
      do {
        //randomly pick a type
        const newType = types[Math.floor(Math.random() * types.length)];

        //check if user already has an entry for picked type
        const findPair = usersTypes.find(
          (userType) =>
            userType.user_id == user.id && userType.type_id == newType.id,
        );
        foundUnique = !findPair;

        //if user does not have an entry, add it to the table
        if (foundUnique) {
          const newUserType = {
            user_id: user.id,
            type_id: newType.id,
          };
          usersTypes.push(await createUserType(newUserType));
        }

        //if the type is not unique, search again
      } while (!foundUnique);
    }
  }

  // seed users_goals table
  const usersGoals = [];
  for (let i = 0; i < users.length; i++) {
    //give every user 3 goals (based on their interests)
    const user = users[i];
    let numGoals = 3;

    //find types of goals the user is interested in   TODO: replace this with a query of the users_types table
    const selectedTypes = usersTypes.filter(
      (userType) => userType.user_id == user.id,
    );

    //find goals the user is interested in (based on type of goal)   TODO: replace this with a query of the users_goals table
    const possibleGoals = goals.filter((goal) => {
      const goalTypeInSelectedTypes = selectedTypes.find((userType) => {
        return userType.type_id == goal.type_id;
      });

      return goalTypeInSelectedTypes ? true : false;
    });

    //create new users_goals rows for the user
    const assignedGoals = [];
    for (let j = 0; j < numGoals; j++) {
      let foundUnique = false;
      do {
        //randomly pick a goal (from desired goals)
        const newGoal =
          possibleGoals[Math.floor(Math.random() * possibleGoals.length)];

        //check if user already has the randomly picked goal for the day
        const newGoalInAssignedGoals = assignedGoals.find(
          (goal) => goal.id == newGoal.id,
        );
        foundUnique = !newGoalInAssignedGoals;

        //if the goal is unique, add it to the users_goals table
        if (foundUnique) {
          assignedGoals.push(newGoal);
          const newUserGoal = {
            user_id: user.id,
            goal_id: newGoal.id,
            date_made: new Date(),
          };
          usersGoals.push(await createUserGoal(newUserGoal));
        }

        //exit condition (no more possible goals to add)
        if (assignedGoals.length >= possibleGoals.length) break;

        //if the goal id not unique, search again
      } while (!foundUnique);
    }
  }
}
