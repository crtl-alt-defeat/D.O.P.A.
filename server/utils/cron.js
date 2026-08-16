import cron from "node-cron";
import { getUsers } from "../db/queries/users.js";
import { getGoals, getPotentialGoals } from "../db/queries/goals.js";
import { createUserGoal, getDailyGoals } from "../db/queries/usersGoals.js";

export function getCronString() {
  return process.env.DAILY_GOAL_CRON || "0 4 * * *";
}

export async function goalsScheduler() {
  cron.schedule(
    getCronString(),
    async () => {
      console.log(
        "--📅 giving users goals for the day:",
        new Date().toLocaleString(),
      );
      await giveUsersGoals();
    },
    { timezone: "America/Chicago" },
  );
}

//alternative goals scheduler: runs every 12 minutes; gives goals to any user who doesn't have goals for the day
export async function goalsSchedulerV2() {
  cron.schedule("*/16 * * * *", async () => {
    console.log(
      "--📅 attempting to give users goals:",
      new Date().toLocaleString(),
    );
    const users = await getUsers();

    for (const user of users) {
      await attemptGiveUserRandomGoals(user);
    }
  });
}

async function giveUsersGoals() {
  const users = await getUsers();

  for (const user of users) {
    await giveUserRandomGoals(user.id);
  }
}

export async function attemptGiveUserRandomGoals(user) {
  const dailyGoals = await getDailyGoals(user.id);
  if (dailyGoals.length == 0) {
    console.log(`  ⤷ giving goals to ${user.name}`);
    const createdUsersGoals = await giveUserRandomGoals(user.id);
    return createdUsersGoals;
  } else {
    return null;
  }
}

async function giveUserRandomGoals(userId) {
  const randomGoals = await getRandomGoals(userId);

  const createdUsersGoals = [];
  for (const goal of randomGoals) {
    const date = new Date();
    const localDate = date.toLocaleString("en-US", {
      timeZone: "America/Chicago",
    });
    const newUserGoal = {
      user_id: userId,
      goal_id: goal.id,
      date_made: localDate,
    };
    const created = await createUserGoal(newUserGoal);
    createdUsersGoals.push(created);
  }

  return createdUsersGoals;
}

//get 3 goals (preferably of selected types)
async function getRandomGoals(userId) {
  const goals = await getGoals();
  const potentialGoals = await getPotentialGoals(userId);

  const newGoals = [];

  //get up to 3 potential goals
  if (potentialGoals.length > 0) {
    for (let i = 0; i < 3; i++) {
      let newGoal = getRandomUnique(potentialGoals, newGoals);

      //if newGoal found, add to array
      if (newGoal) {
        newGoals.push(newGoal);
      } else {
        //if not found, stop looking for one
        break;
      }
    }
  }

  //if less than 3 potential goals found, get up to 3 random goals
  for (let i = newGoals.length; i < 3; i++) {
    let newGoal = getRandomUnique(goals, newGoals);
    if (newGoal) {
      newGoals.push(newGoal);
    } else {
      break;
    }
  }

  return newGoals;
}

//helper function: get a random unique item from source array
function getRandomUnique(sourceArr, outputArr) {
  let uniqueItem = null;

  let foundUnique = false;
  do {
    const randIndex = Math.floor(Math.random() * sourceArr.length);
    const randItem = sourceArr[randIndex];

    const findItem = outputArr.find((item) => item.id == randItem.id);
    foundUnique = !findItem;

    if (foundUnique) {
      uniqueItem = randItem;
    } else if (outputArr.length >= sourceArr.length) {
      //if output array already has all items from source array, stop searching
      break;
    }
  } while (!foundUnique);

  return uniqueItem;
}
