import axios from "axios";

const API = import.meta.env.VITE_API || "localhost:3000";
const typesAPI = API + "/types";

export async function createType(name) {
  try {
    const newType = {
      name: name,
    };

    const config = {
      "Content-type": "application/json",
    };

    await axios.post(typesAPI, newType, config);
  } catch (error) {
    console.error(error);
  }
}

export async function getTypes() {
  try {
    const { data } = await axios.get(typesAPI);
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function getType(id) {
  try {
    const { data } = await axios.get(typesAPI + `/${id}`);
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function getTypesByUserId(userId) {
  try {
    const { data } = await axios.get(typesAPI + `/user/${userId}`);
    return data;
  } catch (error) {
    console.error(error);
  }
}
