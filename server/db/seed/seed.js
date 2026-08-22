//logging
import { shouldLog, createLogFile, logObjectArray } from "./logSeed.js";

//seed functions
import seedUsers from "./components/seedUsers.js";
import seedTypes from "./components/seedTypes.js";
import seedGoals from "./components/seedGoals.js";
import seedUsersTypes from "./components/seedUsersTypes.js";
//import seedSelectedGoals from "./components/seedSelectedGoals.js";
import seedUsersGoals from "./components/seedUsersGoals.js";

//database queries
import { getUsers } from "../queries/users.js";
import { getTypes } from "../queries/types.js";
import { getGoals } from "../queries/goals.js";
import { getUsersTypes } from "../queries/usersTypes.js";
//import { getSelectedGoals } from "../queries/selectedGoals.js";
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
  const SELECTED_GOALS_INFO_FILE = LOG_PATH + "logged_selected_goals.txt";
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
      console.error("ERROR: failed to seed users:\n", e);
    }
    const users = await getUsers();
    if (logging) await logObjectArray(USER_INFO_FILE, newUsers || users);
  }

  // seed types table
  try {
    await seedTypes();
  } catch (e) {
    console.error("ERROR: failed to seed types:\n", e);
  }
  const types = await getTypes();
  if (logging) await logObjectArray(TYPES_INFO_FILE, types);

  // seed goals table
  try {
    await seedGoals(types);
  } catch (e) {
    console.error("ERROR: failed to seed goals:\n", e);
  }
  const goals = await getGoals();
  if (logging) await logObjectArray(GOALS_INFO_FILE, goals);

  if (process.env.SYNC_CREATE_FAKE_USERS == "true") {
    // seed users_types table
    try {
      if (!newUsers) throw new Error("prequisite users failed to seed");
      await seedUsersTypes(newUsers, types);
    } catch (e) {
      console.error("ERROR: failed to seed users_types:\n", e);
    }
    const usersTypes = await getUsersTypes();
    if (logging) await logObjectArray(USERS_TYPES_INFO_FILE, usersTypes);

    //seed selected_goals table
    // try {
    //   if (!newUsers) throw new Error("prequisite users failed to seed");
    //   await seedSelectedGoals(newUsers, usersTypes);
    // } catch (e) {
    //   console.error("ERROR: failed to seed users_types:\n", e);
    // }
    // const selectedGoals = await getSelectedGoals();
    // if (logging) await logObjectArray(SELECTED_GOALS_INFO_FILE, selectedGoals);

    // seed users_goals table
    try {
      if (!newUsers) throw new Error("prequisite users failed to seed");
      await seedUsersGoals(3, newUsers, goals, usersTypes);
    } catch (e) {
      console.error("ERROR: failed to seed users_goals:\n", e);
    }
    const usersGoals = await getUsersGoals();
    if (logging) await logObjectArray(USERS_GOALS_INFO_FILE, usersGoals);
  }
}
