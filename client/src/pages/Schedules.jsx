import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import "./Schedules.css";

import { getWeeklyGoals, markGoalIncomplete } from "../api/usersGoals";
import { completeGoal } from "../api/goals";
import { getTypes } from "../api/types";

function SchedulesPage() {
  const { token } = useAuth();
  const [goals, setGoals] = useState(null);

  const [selectedGoal, setSelectedGoal] = useState(null);
  const [types, setTypes] = useState([]);
  useEffect(() => {
    async function loadTypes() {
      const data = await getTypes();
      setTypes(data);
    }

    loadTypes();
  }, []);
  function getTypeName(typeId) {
    const found = types.find((t) => t.id === typeId);
    return found ? found.name : typeId; // fallback to number
  }

  async function syncGoals() {
    const data = await getWeeklyGoals(token);
    console.log("data:", data);

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

  // popup opens for ALL goals now
  function handleGoalClick(goal) {
    setSelectedGoal(goal);
  }

  async function uncompleteGoal() {
    await markGoalIncomplete(selectedGoal.user_id, selectedGoal.goal_id, token);
    await syncGoals();
    setSelectedGoal(null);
  }

  async function handleCompleteGoal() {
    console.log(selectedGoal);
    await completeGoal(selectedGoal.user_goal_id, token);
    await syncGoals();
    setSelectedGoal(null);
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
              <strong>Type:</strong> {getTypeName(selectedGoal.type_id)}
            </p>

            <p>
              <strong>Status:</strong> {selectedGoal.status}
            </p>

            {selectedGoal.status === "Not Completed" && (
              <button className="complete-btn" onClick={handleCompleteGoal}>
                Mark Complete
              </button>
            )}

            {selectedGoal.status !== "Not Completed" && (
              <button className="uncomplete-btn" onClick={uncompleteGoal}>
                Mark Incomplete
              </button>
            )}

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
