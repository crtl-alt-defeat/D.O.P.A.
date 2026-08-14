import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { addGoal, getUncompletedGoals, completeGoal } from "../api/goals";
import { getTypes } from "../api/types";
//import { createUserType } from "../api/usersTypes";

function HomePage() {
  const { token, hasGottenGoals, getSelectedTypes } = useAuth();

  const [name, setName] = useState("");
  const [goals, setGoals] = useState([]);

  const [allTypes, setAllTypes] = useState([]);
  const [userTypes, setUserTypes] = useState([]);
  const [selectedTypeId, setSelectedTypeId] = useState("");

  const [attachTypeId, setAttachTypeId] = useState("");

  async function loadGoals() {
    console.log("--loadGoals: started");
    if (!token) return;

    const data = await getUncompletedGoals(token);
    console.log("--loadGoals: data:", data);

    const today = new Date().toISOString().split("T")[0];

    const todaysGoals = data.filter((goal) => {
      if (!goal.date_made) return false;

      const made = goal.date_made.split("T")[0];
      //const today = new Date();

      // console.log(
      //   "--loadGoals: same year:",
      //   made.getFullYear() === today.getFullYear(),
      //   made.getFullYear(),
      //   today.getFullYear(),
      // );
      // console.log(
      //   "--loadGoals: same month:",
      //   made.getMonth() === today.getMonth(),
      //   made.getMonth(),
      //   today.getMonth(),
      // );
      // console.log(
      //   "--loadGoals: same date:",
      //   made.getDate() === today.getDate(),
      //   made.getDate(),
      //   today.getDate(),
      // );

      // return (
      //   made.getFullYear() === today.getFullYear() &&
      //   made.getMonth() === today.getMonth() &&
      //   made.getDate() === today.getDate()
      // );
      console.log(today, made);
      return today === made;
    });
    console.log("--loadGoals: todaysGoals:", todaysGoals);
    setGoals(todaysGoals);

    //console.log("--loadGoals: ended");
  }
  async function loadTypes() {
    console.log("--loadTypes: started");
    if (!token) return;

    const systemTypes = await getTypes();
    const ownedTypes = await getSelectedTypes();

    setAllTypes(systemTypes);
    setUserTypes(ownedTypes);

    if (ownedTypes.length > 0 && !selectedTypeId) {
      setSelectedTypeId(ownedTypes[0].id);
    }
  }

  async function handleAddGoal() {
    console.log("--handleAddGoal: started");
    if (!name.trim()) return;
    if (!selectedTypeId) return;

    await addGoal(name, selectedTypeId, token);
    setName("");
    await loadGoals();
  }

  // async function handleAttachType() {
  //   if (!attachTypeId) return;

  //   await createUserType({
  //     user_id: user.id,
  //     type_id: attachTypeId,
  //   });

  //   await loadTypes();
  //   setAttachTypeId("");
  // }

  async function handleComplete(goalId) {
    console.log("--handleComplete: started");
    await completeGoal(goalId, token);
    await loadGoals();
  }

  useEffect(() => {
    loadGoals();
    loadTypes();
  }, [hasGottenGoals]);

  return (
    <div>
      <h2>Your Stuff</h2>

      <section>
        <h3>Your Daily Goals</h3>
        {console.log("--return: goals:", goals)}
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
        <select
          value={selectedTypeId}
          onChange={(e) => setSelectedTypeId(e.target.value)}
        >
          <option value="">Select one of your types...</option>

          {userTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>

        <button type="button" onClick={handleAddGoal}>
          Add
        </button>
      </section>
    </div>
  );
}

export default HomePage;
