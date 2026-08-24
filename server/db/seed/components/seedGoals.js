import { createGoal } from "../../queries/goals.js";
import { getTypeByName } from "../../queries/types.js";

export default async function seedGoals(types) {
  const goals = [];

  const selfCare = await getTypeByName("self care");
  const household = await getTypeByName("household");
  const workSchool = await getTypeByName("work/school");
  const relationship = await getTypeByName("relationship");

  if (selfCare) {
    goals.push(
      await createGoal({
        name: "brush teeth",
        type_id: selfCare.id,
      }),
    );
    goals.push(
      await createGoal({
        name: "take meds",
        type_id: selfCare.id,
      }),
    );
    goals.push(
      await createGoal({
        name: "take a shower",
        type_id: selfCare.id,
      }),
    );
    goals.push(
      await createGoal({
        name: "exercise",
        type_id: selfCare.id,
      }),
    );
    goals.push(
      await createGoal({
        name: "touch grass",
        type_id: selfCare.id,
      }),
    );
  }

  if (household) {
    goals.push(
      await createGoal({
        name: "do laundry",
        type_id: household.id,
      }),
    );
    goals.push(
      await createGoal({
        name: "clean room (min. 4 items)",
        type_id: household.id,
      }),
    );
    goals.push(
      await createGoal({
        name: "get groceries",
        type_id: household.id,
      }),
    );
    goals.push(
      await createGoal({
        name: "do dishes",
        type_id: household.id,
      }),
    );
  }

  if (workSchool) {
    goals.push(
      await createGoal({
        name: "check email",
        type_id: workSchool.id,
      }),
    );
    goals.push(
      await createGoal({
        name: "work on deadlines",
        type_id: workSchool.id,
      }),
    );
    goals.push(
      await createGoal({
        name: "make a task list",
        type_id: workSchool.id,
      }),
    );
    goals.push(
      await createGoal({
        name: "prepare outfit for tomorrow",
        type_id: workSchool.id,
      }),
    );
  }

  if (relationship) {
    goals.push(
      await createGoal({
        name: "Kiss your significant other",
        type_id: relationship.id,
      }),
    );
    goals.push(
      await createGoal({
        name: "Text a friend or family member",
        type_id: relationship.id,
      }),
    );
    goals.push(
      await createGoal({
        name: "make plans with someone",
        type_id: relationship.id,
      }),
    );
  }
  //deadline goals
  //goals.push(await createGoal("birthday reminder", types[3].id));
  //goals.push(await createGoal("appointment reminder", types[3].id));

  return goals;
}
