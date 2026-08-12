//logging
import { shouldLog, createLogFile, logObjectArray } from "./logSeed.js";

//seed functions
import seedUsers from "./components/seedUsers.js";
import seedTypes from "./components/seedTypes.js";
import seedGoals from "./components/seedGoals.js";
import seedUsersTypes from "./components/seedUsersTypes.js";
import seedUsersGoals from "./components/seedUsersGoals.js";

//database queries
import { getUsers } from "../queries/users.js";
import { getTypes } from "../queries/types.js";
import { getGoals } from "../queries/goals.js";
import { getUsersTypes } from "../queries/usersTypes.js";
import { getUsersGoals } from "../queries/usersGoals.js";

//seed tables
export default async function seed() {
  //logging info
  const logging = shouldLog();
  const LOG_PATH = "logs/";
  const USER_INFO_FILE = LOG_PATH + "logged_users.txt";
  const TYPES_INFO_FILE = LOG_PATH + "logged_types.txt";
  const GOALS_INFO_FILE = LOG_PATH + "logged_goals.txt";
  const USERS_TYPES_INFO_FILE = LOG_PATH + "logged_users_types.txt";
  const USERS_GOALS_INFO_FILE = LOG_PATH + "logged_users_goals.txt";

  //create log file(s)
  if (logging) {
    await createLogFile(USER_INFO_FILE);
    await createLogFile(TYPES_INFO_FILE);
    await createLogFile(GOALS_INFO_FILE);
    await createLogFile(USERS_TYPES_INFO_FILE);
    await createLogFile(USERS_GOALS_INFO_FILE);
  }

  // seed users table
  let newUsers;
  if (process.env.SYNC_CREATE_FAKE_USERS == "true") {
    try {
      newUsers = await seedUsers(5);
    } catch (e) {
      console.error("ERROR: failed to seed users:", e.message);
    }
    const users = await getUsers();
    if (logging) await logObjectArray(USER_INFO_FILE, users);
  }

  // seed types table
  try {
    await seedTypes();
  } catch (e) {
    console.error("ERROR: failed to seed types:", e.message);
  }
  const types = await getTypes();
  if (logging) await logObjectArray(TYPES_INFO_FILE, types);

  // seed goals table
  try {
    await seedGoals(types);
  } catch (e) {
    console.error("ERROR: failed to seed goals:", e.message);
  }
  const goals = await getGoals();
  if (logging) await logObjectArray(GOALS_INFO_FILE, goals);

  // seed users_types table
  try {
    if (!newUsers) throw new Error("prequisite users failed to seed");
    await seedUsersTypes(newUsers, types);
  } catch (e) {
    console.error("ERROR: failed to seed users_types:", e.message);
  }
  const usersTypes = await getUsersTypes();
  if (logging) await logObjectArray(USERS_TYPES_INFO_FILE, usersTypes);

  // seed users_goals table
  try {
    if (!newUsers) throw new Error("prequisite users failed to seed");
    await seedUsersGoals(3, newUsers, goals, usersTypes);
  } catch (e) {
    console.error("ERROR: failed to seed users_goals:", e.message);
  }
  const usersGoals = await getUsersGoals();
  if (logging) await logObjectArray(USERS_GOALS_INFO_FILE, usersGoals);
}
