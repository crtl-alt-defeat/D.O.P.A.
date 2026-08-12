import { createGoal } from "../../queries/goals.js";

export default async function seedGoals(types) {
  const goals = [];

  goals.push(
    await createGoal({
      name: "brush teeth",
      type_id: types[0].id,
    }),
  );
  goals.push(
    await createGoal({
      name: "take meds",
      type_id: types[0].id,
    }),
  );
  goals.push(
    await createGoal({
      name: "take a shower",
      type_id: types[0].id,
    }),
  );
  goals.push(
    await createGoal({
      name: "exercise",
      type_id: types[1].id,
    }),
  );
  goals.push(
    await createGoal({
      name: "touch grass",
      type_id: types[1].id,
    }),
  );

  goals.push(
    await createGoal({
      name: "do laundry",
      type_id: types[1].id,
    }),
  );
  goals.push(
    await createGoal({
      name: "clean room (min. 4 items)",
      type_id: types[1].id,
    }),
  );
  goals.push(
    await createGoal({
      name: "get groceries",
      type_id: types[1].id,
    }),
  );
  goals.push(
    await createGoal({
      name: "do dishes",
      type_id: types[1].id,
    }),
  );

  goals.push(
    await createGoal({
      name: "check email",
      type_id: types[2].id,
    }),
  );
  goals.push(
    await createGoal({
      name: "work on deadlines",
      type_id: types[2].id,
    }),
  );
  goals.push(
    await createGoal({
      name: "make a task list",
      type_id: types[2].id,
    }),
  );
  goals.push(
    await createGoal({
      name: "prepare outfit for tomorrow",
      type_id: types[2].id,
    }),
  );

  goals.push(
    await createGoal({
      name: "Kiss your significant other",
      type_id: types[3].id,
    }),
  );
  goals.push(
    await createGoal({
      name: "Text a friend/fam",
      type_id: types[3].id,
    }),
  );
  goals.push(
    await createGoal({
      name: "make plans with someone",
      type_id: types[3].id,
    }),
  );

  //deadline goals
  //goals.push(await createGoal("birthday reminder", types[3].id));
  //goals.push(await createGoal("appointment reminder", types[3].id));

  return goals;
}
