import axios from "axios";
//import { useAuth } from "../auth/AuthContext.jsx";
//import { getGoalsForToday, getPotentialGoals } from "./goals";

export async function getPartialStreak(token) {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const response = await axios.get("api/usersGoals/streak", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      timeZone: userTimeZone,
    },
  });
  const data = await response.data;
  return data.streak;
}

export async function getCompletedGoalsForToday(token) {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const response = await axios.get("/api/usersGoals/completedToday", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      timeZone: userTimeZone,
    },
  });

  return response.data;
}

export async function addUserGoal(name, type_id, token) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const body = { name, type_id };

  const { data } = await axios.post("/api/users/me/goals", body, config);
  return data;
}

/*
export async function replaceUserGoal(token, goalId) {
  try {
    const todaysGoals = await getGoalsForToday();
    const findGoal = todaysGoals.find((userGoal) => userGoal.id == goalId);

    //throw error if goal not found
    if (!findGoal)
      throw new Error("ERROR: replaceUserGoal: cannot replace; goal not found");

    //todo: find valid replacement goals
    const potentialGoals = await getPotentialGoals(token);
    const validGoals;

    //todo: randomly select replacement goal

    //todo: fix usergoal object
    const updatedUserGoal = {
      id: findGoal.user_goal_id,
      name: name,
      email: email,
      password: password,
    };

    const config = {
      "Content-type": "application/json",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    //todo: fix put request
    const { data } = await axios.put(
      "/api/users/me/update",
      updatedUser,
      config,
    );
    return data;
  } catch (e) {
    console.error(e.message);
  }
}
*/
