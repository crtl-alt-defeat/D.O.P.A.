import { createUserGoal } from "../../queries/usersGoals.js";

export default async function seedUsersGoals(num, users, goals, usersTypes) {
  const usersGoals = [];
  for (let i = 0; i < users.length; i++) {
    //give every user 3 goals (based on their interests)
    const user = users[i];

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

    const today = new Date();

    //create new users_goals rows for the user
    const weeksGoals = [];
    for (let j = 0; j < 7; j++) {
      const currDay = new Date();
      currDay.setDate(today.getDate() - j);
      const assignedGoals = [];
      for (let k = 0; k < num; k++) {
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
            let dateComplete = null;
            if (Math.random() > 0.33) {
              dateComplete = currDay.toISOString();
            }
            assignedGoals.push(newGoal);
            const newUserGoal = {
              user_id: user.id,
              goal_id: newGoal.id,
              date_made: currDay.toISOString(),
              date_complete: dateComplete,
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

  return usersGoals;
}
