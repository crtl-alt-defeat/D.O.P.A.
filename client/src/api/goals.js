import axios from "axios";

export async function createGoal(name, type_id) {
  try {
    const newGoal = {
      name: name,
      type_id: type_id,
    };

    const config = {
      "Content-type": "application/json",
    };

    await axios.post("/api/goals", newUser, config);
  } catch (error) {
    console.error(error);
  }
}

export async function getGoals() {
  try {
    const { data } = await axios.get("/api/goals");
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getGoal(id) {
  try {
    const { data } = await axios.get("/api/goals" + `/${id}`);
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function getGoalByUserId(userId) {
  try {
    const { data } = await axios.get("/api/goals" + `/user/${userId}`);
    return data;
  } catch (error) {
    console.error(error);
  }
}

//todo: export async function getGoalsByTypeId(typeId) (get goals by type_id)

export async function getWeeklyGoals(token) {
  try {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        timeZone: userTimeZone,
      },
    };

    const { data } = await axios.get("/api/users/me/schedules", config);
    return data;
  } catch (error) {
    console.error(error);
  }
}
export async function getGoalsForToday(token) {
  try {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        timeZone: userTimeZone,
      },
    };

    const { data } = await axios.get("/api/users/me/daily", config);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getPotentialGoals(token) {
  try {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        timeZone: userTimeZone,
      },
    };

    const { data } = await axios.get("/api/users/me/potentialGoals", config);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

/* added Fri */
export async function getUncompletedGoals(token) {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      timeZone: userTimeZone,
    },
  };

  const { data } = await axios.get("/api/users/me/goals/uncompleted", config);
  return data;
}

export async function completeGoal(goalId, token) {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      timeZone: userTimeZone,
    },
  };

  const { data } = await axios.put(
    `/api/users/me/goals/${goalId}/complete`,
    {},
    config,
  );
  return data;
}
