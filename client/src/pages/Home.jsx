import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";

import { getUncompletedGoals, completeGoal } from "../api/goals";
import { getTypeByName } from "../api/types";
import { addUserGoal } from "../api/usersGoals";

function HomePage() {
  const { token, hasGottenGoals, getSelectedTypes } = useAuth();

  const [name, setName] = useState("");
  const [goals, setGoals] = useState([]);

  const [allTypes, setAllTypes] = useState([]);
  const [userTypes, setUserTypes] = useState([]);
  const [selectedTypeId, setSelectedTypeId] = useState("");

  const [attachTypeId, setAttachTypeId] = useState("");

  async function loadGoals() {
    if (!token) return;

    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log("pages:Home:loadGoals: timezone =", userTimeZone);
    const uncompleted = await getUncompletedGoals(token);
    setGoals(uncompleted);
  }

  async function handleAddGoal() {
    if (!name.trim()) return;
    //if (!selectedTypeId) return;
    const custom = await getTypeByName("custom");
    await addUserGoal(name, custom.id, token);
    setName("");
    await loadGoals();
  }

  async function handleComplete(goalId) {
    await completeGoal(goalId, token);
    await loadGoals();
  }

  useEffect(() => {
    loadGoals();
    //loadTypes();
  }, [hasGottenGoals]);

  return (
    <div>
      <h2>Your Stuff</h2>

      <section>
        <h3>Your Daily Goals</h3>
        <ul>
          {goals.map((goal) => (
            <li key={goal.id}>
              {goal.name}
              <button onClick={() => handleComplete(goal.id)}>Complete</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Add a New Goal</h3>

        <input
          type="text"
          placeholder="Type a new goal..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {/* <select
          value={selectedTypeId}
          onChange={(e) => setSelectedTypeId(e.target.value)}
        >
          <option value="">Select one of your types...</option>

          {userTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select> */}

        <button type="button" onClick={handleAddGoal}>
          Add
        </button>
      </section>
    </div>
  );
}

export default HomePage;
