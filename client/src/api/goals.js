import axios from "axios";

const API = import.meta.env.VITE_API;

export async function createGoal(name, type_id) {
  try {
    const newGoal = {
      name: name,
      type_id: type_id,
    };

    const config = {
      "Content-type": "application/json",
    };

    await axios.post(API + "/users/register", newUser, config);
  } catch (error) {
    console.error(error);
  }
}

export async function getGoals() {
  try {
    const { data } = await axios.get(API + "/goals");
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getGoal(id) {
  try {
    const { data } = await axios.get(API + `/goals/${id}`);
  } catch (error) {
    console.error(error);
  }
}
