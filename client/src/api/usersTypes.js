import axios from "axios";

export async function createUserType({ user_id, type_id }) {
  try {
    const { data } = await axios.post("/api/users-types", {
      user_id,
      type_id,
    });

    return data;
  } catch (error) {
    console.error("Failed to attach type to user:", error);
    throw error;
  }
}
/* Related to selections */
export async function getUserTypes(user_id) {
  const { data } = await axios.get(`/api/types/user/${user_id}`);
  return data;
}
