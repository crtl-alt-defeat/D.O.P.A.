import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { subscribeUser, sendTestPush } from "../../notifications";
//components
import UserInfo from "./UserInfo";
import UserForm from "./UserForm";
import TypesForm from "./TypesForm";

function SettingsPage() {
  const [subscription, setSubscription] = useState(null);

  const { getUser, updateUser, token } = useAuth();
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
      {/* Notification related Ignore */}

      <button
        onClick={async () => {
          //console.log("TOKEN FROM AUTH:", token);
          const sub = await subscribeUser(token);
          setSubscription(sub);
        }}
      >
        Enable Notifications
      </button>
      <button
        onClick={async () => {
          if (!window._pushSubscription) {
            //console.log("No subscription yet");
            return;
          }
          await sendTestPush(window._pushSubscription);
        }}
      >
        Send Test Push
      </button>
    </div>
  ) : (
    <div>
      <h2>Account Settings</h2>
      <p>loading...</p>
    </div>
  );
}
export default SettingsPage;
