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
      await giveUsersGoals();
    },
    { timezone: "America/Chicago" },
  );
}

//alternative goals scheduler: runs every 12 minutes; gives goals to any user who doesn't have goals for the day
export async function goalsSchedulerV2() {
  cron.schedule("*/12 * * * *", async () => {
    const users = await getUsers();

    for (const user of users) {
      const dailyGoals = await getDailyGoals(user.id);
      if (dailyGoals.length == 0) {
        await giveUserRandomGoals(user.id);
      }
    }
  });
}

async function giveUsersGoals() {
  console.log("Added new goals for users:", new Date().toLocaleString());
  const users = await getUsers();

  for (const user of users) {
    await giveUserRandomGoals(user.id);
  }
}

async function giveUserRandomGoals(userId) {
  const randomGoals = await getRandomGoals(userId);

  for (const goal of randomGoals) {
    const newUserGoal = {
      user_id: user.id,
      goal_id: goal.id,
      date_made: new Date(),
    };
    const created = await createUserGoal(newUserGoal);
  }
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
