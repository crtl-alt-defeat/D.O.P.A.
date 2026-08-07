import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";

function SettingsPage() {
  const { getUser, updateUser } = useAuth();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  async function handleUpdate(formData) {
    console.log("test");
    setError(null);

    const id = user.id;
    const name = formData.get("name") || user.name;
    const email = formData.get("email") || user.email;
    const password = formData.get("password") || user.password;

    try {
      const data = await updateUser(id, name, email, password);
      setUser(data);
    } catch (e) {
      console.error(e.message);
    }
  }

  async function syncUser() {
    const data = await getUser();
    setUser(data);
  }

  useEffect(() => {
    syncUser();
  }, []);

  return user ? (
    <div>
      <h2>Account Settings</h2>

      <section>
        <h3>Your Current Info</h3>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        <p>Password: *********</p>
      </section>

      <form action={handleUpdate}>
        <h3>Update Your Profile</h3>
        <p>
          <label>
            Change Name:{" "}
            <input type="text" name="name" placeholder="New Name" />
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
    </div>
  ) : (
    <div>
      <h2>Account Settings</h2>
      <p>loading...</p>
    </div>
  );
}
export default SettingsPage;
