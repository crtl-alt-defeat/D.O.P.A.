import axios from "axios";

export async function selectGoal(userId, goalId, token) {
  return axios.post(
    "/api/selectedGoals",
    { user_id: userId, goal_id: goalId },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
}

export async function deselectGoal(userId, goalId, token) {
  return axios.delete("/api/selectedGoals", {
    headers: { Authorization: `Bearer ${token}` },
    data: { user_id: userId, goal_id: goalId },
  });
}

export async function getSelectedGoals(user_id) {
  try {
    const { data } = await axios.get(`/api/selectedGoals/${user_id}`);
    return data;
  } catch (error) {
    console.error("Error fetching selected goals:", error);
    return [];
  }
}
export async function getSelectedGoalsByType(userId, typeId, token) {
  try {
    const { data } = await axios.get(
      `/api/selectedGoals/user/${userId}/type/${typeId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

/* export async function getSelectedGoalsByType(user_id, type_id) {
  try {
    const { data } = await axios.get(
      `/api/selectedGoals/${user_id}/type/${type_id}`,
    );
    return data;
  } catch (error) {
    console.error("Error fetching selected goals by type:", error);
    return [];
  }
} */
