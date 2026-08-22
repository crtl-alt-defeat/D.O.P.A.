// import { createSelectedGoal } from "../../queries/selectedGoals.js";

// export default async function seedSelectedGoals(users, usersTypes, goals) {
//   const selectedGoals = [];

//   //loop through users
//   for (const user of users) {
//     //loop through types selected by user
//     const usersTypesOfUser = usersTypes.filter(
//       (userType) => (userType.user_id = user.id),
//     );
//     for (const userType of usersTypesOfUser) {
//       //loop through goals of selected type
//       const goalsOfType = goals.filter(
//         (goal) => (goal.type_id = userType.type_id),
//       );
//       for (const goal of goalsOfType) {
//         //create entry in selected_goals table, and push entry info to output array
//         const selectedGoal = await createSelectedGoal(user.id, goal.id);
//         selectedGoal.push(selectedGoal);
//       }
//     }
//   }

//   //return output array
//   return selectedGoals;
// }
