import { userSelectGoal } from "../../queries/selectedGoals.js";
import { getTypesByUserId } from "../../queries/types.js";
import { getGoalsByTypeId } from "../../queries/goals.js";

export default async function seedSelectedGoals(users) {
  const selectedGoals = [];

  //loop through users
  for (const user of users) {
    //loop through types selected by user
    const types = await getTypesByUserId(user.id);
    for (const type of types) {
      //loop through goals of selected type
      const goals = await getGoalsByTypeId(type.id);
      for (const goal of goals) {
        //create entry in selected_goals table, and push entry info to output array
        const newSelectedGoal = {
          user_id: user.id,
          goal_id: goal.id,
        };
        const selectedGoal = await userSelectGoal(newSelectedGoal);
        selectedGoals.push(selectedGoal);
      }
    }
  }

  //return output array
  return selectedGoals;
}
