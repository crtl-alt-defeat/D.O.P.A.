import cron from "node-cron";
import { getUsers } from "../db/queries/users.js";
import { getGoals, getPotentialGoals } from "../db/queries/goals.js";
import { createUserGoal } from "../db/queries/usersGoals.js";

export async function goalsScheduler() {
  cron.schedule("* * * * *", async () => {
    const users = await getUsers();
    console.log(new Date().toLocaleString());

    for (const user of users) {
      const randomGoals = await getRandomGoals(user.id);
      console.log(user.name, randomGoals);

      for (const goal of randomGoals) {
        const newUserGoal = {
          user_id: user.id,
          goal_id: goal.id,
          date_made: new Date(),
        };
        const created = await createUserGoal(newUserGoal);
        console.log(created);
      }
    }
  });
}

async function getRandomGoals(userId) {
  const potentialGoals = await getPotentialGoals(userId);

  const newGoals = [];
  if (potentialGoals.length > 0) {
    for (let i = 0; i < 3; i++) {
      let foundUnique = false;
      do {
        const newGoalIndex = Math.floor(Math.random() * potentialGoals.length);
        const newGoal = potentialGoals[newGoalIndex];

        const findGoal = newGoals.find((goal) => goal.id == newGoal.id);
        foundUnique = !findGoal;

        if (foundUnique) {
          newGoals.push(newGoal);
        } else if (newGoals.length == potentialGoals.length) {
          break;
        }
      } while (!foundUnique);
    }
  }

  const goals = getGoals();
  for (let i = newGoals.length; i <= 3; i++) {
    let foundUnique = false;
    do {
      const newGoalIndex = Math.floor(Math.random() * potentialGoals.length);
      const newGoal = potentialGoals[newGoalIndex];

      const findGoal = newGoals.find((goal) => goal.id == newGoal.id);
      foundUnique = !findGoal;

      if (foundUnique) {
        newGoals.push(newGoal);
      } else if (newGoals.length == potentialGoals.length) {
        break;
      }
    } while (!foundUnique);
  }

  return newGoals;
}
