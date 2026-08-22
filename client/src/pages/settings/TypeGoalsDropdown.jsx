import { useEffect, useState } from "react";
import { getGoalsByTypeId } from "../../api/goals";
import {
  getSelectedGoalsByType,
  selectGoal,
  deselectGoal,
} from "../../api/selectedGoals";
import { useAuth } from "../../auth/AuthContext";

function TypeGoalsDropdown({ type, user }) {
  const { token } = useAuth();
  const [goals, setGoals] = useState([]);
  const [selectedGoals, setSelectedGoals] = useState([]);

  useEffect(() => {
    async function load() {
      const allGoals = await getGoalsByTypeId(type.id, token);
      const selected = await getSelectedGoalsByType(user.id, type.id, token);

      console.log("Type", type.id, "allGoals:", allGoals);
      console.log("Type", type.id, "selected:", selected);

      setGoals(allGoals);
      setSelectedGoals(selected.map((g) => g.id));
    }

    load();
  }, [type.id, user.id, token]); // include token in dependency list

  async function toggle(goal_id) {
    const isSelected = selectedGoals.includes(goal_id);

    if (isSelected) {
      await deselectGoal(user.id, goal_id, token);
      setSelectedGoals((prev) => prev.filter((id) => id !== goal_id));
    } else {
      await selectGoal(user.id, goal_id, token);
      setSelectedGoals((prev) => [...prev, goal_id]);
    }
  }

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <h4>{type.name}</h4>

      {goals.map((goal) => (
        <div key={goal.id}>
          <label>
            <input
              type="checkbox"
              checked={selectedGoals.includes(goal.id)}
              onChange={() => toggle(goal.id)}
            />
            {goal.name}
          </label>
        </div>
      ))}
    </div>
  );
}

export default TypeGoalsDropdown;
