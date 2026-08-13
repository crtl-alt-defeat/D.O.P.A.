import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";

export default function UserForm({ user, syncUser }) {
  const { updateUser } = useAuth();
  const [error, setError] = useState(null);

  async function handleUpdateUser(formData) {
    setError(null);

    const id = user.id;
    const name = formData.get("name") || user.name;
    const email = formData.get("email") || user.email;
    const password = formData.get("password") || user.password;

    try {
      const data = await updateUser(id, name, email, password);
      syncUser();
    } catch (e) {
      console.error(e.message);
      setError(e.message);
    }
  }

  return (
    <form action={handleUpdateUser}>
      <h3>Update Your Profile</h3>
      <p>
        <label>
          Change Name: <input type="text" name="name" placeholder="New Name" />
        </label>
      </p>
      <p>
        <label>
          Change Email:{" "}
          <input type="email" name="email" placeholder="New Email" />
        </label>
      </p>
      <p>
        <label>
          Change Password:{" "}
          <input type="password" name="password" placeholder="New Password" />
        </label>
      </p>
      <button type="submit">Save Changes</button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
