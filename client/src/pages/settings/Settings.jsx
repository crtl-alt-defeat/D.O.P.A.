import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { subscribeUser, sendTestPush } from "../../notifications";
//components
import UserInfo from "./UserInfo";
import UserForm from "./UserForm";
import TypesForm from "./TypesForm";

function SettingsPage() {
  const [subscription, setSubscription] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const { getUser, updateUser, token } = useAuth();
  const [user, setUser] = useState(null);

  async function syncUser() {
    const data = await getUser();
    setUser(data);
  }

  useEffect(() => {
    syncUser();
  }, [token]);
  useEffect(() => {
    async function checkExistingSubscription() {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();

      if (sub) {
        window._pushSubscription = sub;
        setSubscription(sub);
        setNotificationsEnabled(true);
      }
    }

    checkExistingSubscription();
  }, []);

  return user ? (
    <div>
      <h2>Account Settings</h2>

      <UserInfo user={user} />
      <UserForm user={user} syncUser={syncUser} />
      <TypesForm user={user} />
      <label className="notif-toggle">
        <input
          type="checkbox"
          checked={notificationsEnabled}
          onChange={async (e) => {
            const checked = e.target.checked;
            setNotificationsEnabled(checked);

            if (checked) {
              // SUBSCRIBE
              const sub = await subscribeUser(token);
              setSubscription(sub);
              window._pushSubscription = sub;
            } else {
              // UNSUBSCRIBE
              if (window._pushSubscription) {
                try {
                  await window._pushSubscription.unsubscribe();
                  console.log("Push subscription removed");
                } catch (err) {
                  console.error("Failed to unsubscribe:", err);
                }

                window._pushSubscription = null;
                setSubscription(null);
              }
            }
          }}
        />
        Enable Notifications
      </label>
      <button
        type="button"
        onClick={async () => {
          if (!window._pushSubscription) return;
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
