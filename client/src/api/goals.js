import axios from "axios";

const API = import.meta.env.VITE_API || "http://localhost:3000";
const goalsAPI = API + "/goals";

export async function createGoal(name, type_id) {
  try {
    const newGoal = {
      name: name,
      type_id: type_id,
    };

    const config = {
      "Content-type": "application/json",
    };

    await axios.post(goalsAPI, newUser, config);
  } catch (error) {
    console.error(error);
  }
}

export async function getGoals() {
  try {
    const { data } = await axios.get(goalsAPI);
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getGoal(id) {
  try {
    const { data } = await axios.get(goalsAPI + `/${id}`);
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function getGoalByUserId(userId) {
  try {
    const { data } = await axios.get(goalsAPI + `/user/${userId}`);
    return data;
  } catch (error) {
    console.error(error);
  }
}

//todo: export async function getGoalsByTypeId(typeId) (get goals by type_id)
