import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { addGoal, getUncompletedGoals, completeGoal } from "../api/goals";

function HomePage() {
  const { token } = useAuth();
  const [name, setName] = useState("");
  const [goals, setGoals] = useState([]);

  async function loadGoals() {
    if (!token) return;
    const data = await getUncompletedGoals(token);
    setGoals(data);
  }

  async function handleAdd() {
    if (!name.trim()) return;
    const type_id = 1;

    await addGoal(name, type_id, token);
    setName("");
    await loadGoals();
  }

  async function handleComplete(goalId) {
    await completeGoal(goalId, token);
    await loadGoals(); // refresh list
  }

  useEffect(() => {
    loadGoals();
  }, [token]);

  return (
    <div>
      <h2>Your Stuff</h2>

      <section>
        <h3>Your 3 Goals</h3>
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
        <button type="button" onClick={handleAdd}>
          Add
        </button>
      </section>
    </div>
  );
}

export default HomePage;
