import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { subscribeUser, sendTestPush } from "../../notifications";

import { getTypesByUserId } from "../../api/types";

// components
import UserInfo from "./UserInfo";
import UserForm from "./UserForm";
import TypesForm from "./TypesForm";
import TypeGoalsDropdown from "./TypeGoalsDropdown";

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

  const [userTypes, setUserTypes] = useState([]);

  useEffect(() => {
    if (!user) return;

    async function loadTypes() {
      const types = await getTypesByUserId(user.id);
      setUserTypes(types);
    }

    loadTypes();
  }, [user]);

  return user ? (
    <div>
      <h2>Account Settings</h2>

      <UserInfo user={user} />
      <UserForm user={user} syncUser={syncUser} />
      <TypesForm user={user} />

      {/* MULTI-DROPDOWN SECTION */}
      <div style={{ marginTop: "2rem" }}>
        <h3>Select Goals by Type</h3>

        {userTypes.map((type) => (
          <TypeGoalsDropdown key={type.id} type={type} user={user} />
        ))}
      </div>

      {/* Notifications */}
      <label className="notif-toggle">
        <input
          type="checkbox"
          checked={notificationsEnabled}
          onChange={async (e) => {
            const checked = e.target.checked;
            setNotificationsEnabled(checked);

            if (checked) {
              const sub = await subscribeUser(token);
              setSubscription(sub);
              window._pushSubscription = sub;
            } else {
              if (window._pushSubscription) {
                try {
                  await window._pushSubscription.unsubscribe();
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

/* import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { subscribeUser, sendTestPush } from "../../notifications";
import { getTypes, getTypesByUserId } from "../../api/types";
import { getGoalsByTypeId } from "../../api/goals";
import { getSelectedGoalsByType } from "../../api/selectedGoals";
import { selectGoal, deselectGoal } from "../../api/selectedGoals";
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

  const [userTypes, setUserTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [goals, setGoals] = useState([]);
  const [selectedGoals, setSelectedGoals] = useState([]);

  useEffect(() => {
    if (!user) return;

    async function loadTypes() {
      const types = await getUserTypes(user.id);
      setUserTypes(types);
    }

    loadTypes();
  }, [user]);

  useEffect(() => {
    if (!selectedType || !user) return;

    async function loadGoals() {
      const allGoals = await getGoalsByTypeId(selectedType);
      const selected = await getSelectedGoalsByType(user.id, selectedType);

      setGoals(allGoals);
      setSelectedGoals(selected.map((g) => g.id)); // store selected goal IDs
    }

    loadGoals();
  }, [selectedType, user]);

  async function toggleGoal(goal_id) {
    const isSelected = selectedGoals.includes(goal_id);

    if (isSelected) {
      await deselectGoal(user.id, goal_id);
      setSelectedGoals((prev) => prev.filter((id) => id !== goal_id));
    } else {
      await selectGoal(user.id, goal_id);
      setSelectedGoals((prev) => [...prev, goal_id]);
    }
  }

  /*   const [subscription, setSubscription] = useState(null);
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
 *
  return user ? (
    <div>
      <h2>Account Settings</h2>

      <UserInfo user={user} />
      <UserForm user={user} syncUser={syncUser} />
      <TypesForm user={user} />
      {/* selection dropdown *}
      <div style={{ marginTop: "2rem" }}>
        <h3>Select Goals by Type</h3>

        {/* Dropdown *}
        <select
          value={selectedType || ""}
          onChange={(e) => setSelectedType(Number(e.target.value))}
        >
          <option value="">-- Select a Type --</option>
          {userTypes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        {/* Goals List *}
        {selectedType && (
          <div style={{ marginTop: "1rem" }}>
            <h4>Goals</h4>
            {goals.map((goal) => {
              const isSelected = selectedGoals.includes(goal.id);
              return (
                <div key={goal.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleGoal(goal.id)}
                    />
                    {goal.name}
                  </label>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Notifications checkbox *}
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
 */
