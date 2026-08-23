import { getUsersSelections } from "../../queries/selectedGoals.js";
import { createUserGoal } from "../../queries/usersGoals.js";

export default async function seedUsersGoals(num, users) {
  const usersGoals = [];

  //give every user 3 goals (based on their interests)
  for (const user of users) {
    //find goals the user is interested in (based on type of goal)
    const possibleGoals = await getUsersSelections(user.id);

    //give user goals for every day of the last week
    const today = new Date();
    const weeksGoals = [];
    for (let j = 0; j < 7; j++) {
      const currDay = new Date();
      currDay.setDate(today.getDate() - j);

      //create new users_goals rows for the user
      const assignedGoals = [];
      for (let k = 0; k < num; k++) {
        let foundUnique = false;
        do {
          //randomly pick a goal (from desired goals)
          const newGoal = getRandomGoal(possibleGoals);

          //check if user already has the randomly picked goal for the day
          foundUnique = isUnique(assignedGoals, newGoal);

          //if the goal is unique, add it to the users_goals table
          if (foundUnique) {
            assignedGoals.push(newGoal);

            const userGoal = await handleCreateUserGoal(user, newGoal, currDay);
            usersGoals.push(userGoal);
          }

          //exit condition (no more possible goals to add)
          if (assignedGoals.length >= possibleGoals.length) break;

          //if the goal id not unique, search again
        } while (!foundUnique);

        weeksGoals.push(assignedGoals);
      }
    }
  }

  return usersGoals;
}

//gets a random goal from an array
function getRandomGoal(goals) {
  return goals[Math.floor(Math.random() * goals.length)];
}

//checks if a goal already exists within an array
function isUnique(searchArr, newGoal) {
  const foundItem = searchArr.find((goal) => goal.id == newGoal.id);
  return !foundItem;
}

//creates a new users_goals row for a user
async function handleCreateUserGoal(user, goal, day) {
  let dateComplete = null;
  if (Math.random() > 0.33) {
    dateComplete = day.toISOString();
  }
  const newUserGoal = {
    user_id: user.id,
    goal_id: goal.id,
    date_made: day.toISOString(),
    date_complete: dateComplete,
  };

  return await createUserGoal(newUserGoal);
}
