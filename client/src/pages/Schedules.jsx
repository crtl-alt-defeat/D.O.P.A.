import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import "./Schedules.css";
import { getWeeklyGoals } from "../api/usersgoals";

import { markGoalIncomplete } from "../api/usersgoals";

function SchedulesPage() {
  const { token } = useAuth();
  const [goals, setGoals] = useState(null);

  // Popup state
  const [selectedGoal, setSelectedGoal] = useState(null);

  async function syncGoals() {
    const data = await getWeeklyGoals(token);

    const enriched = data.map((goal) => ({
      ...goal,
      dayOfWeek: new Date(goal.date_made).getDay(),
      status: goal.date_complete ? "Completed Today" : "Not Completed",
    }));

    setGoals(enriched);
  }

  useEffect(() => {
    if (token) {
      syncGoals();
    }
  }, [token]);

  // Open popup only for completed goals
  function handleGoalClick(goal) {
    if (goal.status !== "Not Completed") {
      setSelectedGoal(goal);
    }
  }

  // Uncomplete the selected goal (using API helper)
  async function uncompleteGoal() {
    await markGoalIncomplete(selectedGoal.user_id, selectedGoal.goal_id, token);

    await syncGoals(); // refresh weekly goals
    setSelectedGoal(null);
    console.log("UNCOMPLETE:", selectedGoal);
  }

  if (!goals) return <p>Loading schedules...</p>;

  const days = [[], [], [], [], [], [], []];
  goals.forEach((goal) => {
    days[goal.dayOfWeek].push(goal);
  });

  days.forEach((dayGoals, index) => {
    days[index] = dayGoals.sort((a, b) => {
      const aCompleted = a.status !== "Not Completed";
      const bCompleted = b.status !== "Not Completed";
      return aCompleted - bCompleted;
    });
  });

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div>
      {/* Popup */}
      {selectedGoal && (
        <div className="popup-overlay" onClick={() => setSelectedGoal(null)}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <h3>Goal Details</h3>

            <p>
              <strong>Name:</strong> {selectedGoal.name}
            </p>
            <p>
              <strong>Type:</strong> {selectedGoal.type_id}
            </p>
            <p>
              <strong>Status:</strong> {selectedGoal.status}
            </p>

            <button className="uncomplete-btn" onClick={uncompleteGoal}>
              Mark Incomplete
            </button>

            <button className="close-btn" onClick={() => setSelectedGoal(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      <h2>Schedules</h2>
      <div className="grid-container">
        {days.map((dayGoals, dayIndex) => (
          <div key={dayIndex} className="grid-column">
            <h4 className="day-label">{dayNames[dayIndex]}</h4>
            <div className="grid-tasks">
              {dayGoals.map((goal, index) => (
                <div
                  key={index}
                  className={`grid-item ${goal.status.replace(/\s+/g, "-").toLowerCase()}`}
                  onClick={() => handleGoalClick(goal)}
                >
                  <strong>{goal.name}</strong>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SchedulesPage;
