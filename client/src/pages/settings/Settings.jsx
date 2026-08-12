import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";

//components
import UserInfo from "./UserInfo";
import UserForm from "./UserForm";
import TypesForm from "./TypesForm";

function SettingsPage() {
  const { getUser, updateUser } = useAuth();
  const [user, setUser] = useState(null);

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
      <UserInfo user={user} />
      <UserForm user={user} syncUser={syncUser} />
      <TypesForm user={user} />
    </div>
  ) : (
    <div>
      <h2>Account Settings</h2>
      <p>loading...</p>
    </div>
  );
}
export default SettingsPage;
