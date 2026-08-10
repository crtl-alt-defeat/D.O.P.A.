import axios from "axios";

// const API = import.meta.env.VITE_API || "http://localhost:3000";
// const goalsAPI = API + "/goals";
export async function addGoal(name, type_id, token) {
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

export async function createGoal(name, type_id) {
  try {
    const newGoal = {
      name: name,
      type_id: type_id,
    };

    const config = {
      "Content-type": "application/json",
    };

    await axios.post("/goals", newUser, config);
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
export async function getWeeklyGoals(userId) {
  try {
    const { data } = await axios.get("/me/schedules" + `/user/${userId}`);
    return data;
  } catch (error) {
    console.error(error);
  }
}
export async function getGoalsForToday(token) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
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
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get("/api/users/me/potentialGoals", config);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

//todo: export async function getGoalsByTypeId(typeId) (get goals by type_id)
/* added Fri */
export async function getUncompletedGoals(token) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const { data } = await axios.get("/api/users/me/goals/uncompleted", config);
  return data;
}
export async function completeGoal(goalId, token) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const { data } = await axios.put(
    `/api/users/me/goals/${goalId}/complete`,
    {},
    config,
  );
  return data;
}
