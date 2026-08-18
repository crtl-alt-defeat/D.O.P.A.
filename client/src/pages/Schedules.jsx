import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import "./Schedules.css";
import { getWeeklyGoals } from "../api/goals";

function SchedulesPage() {
  const { token } = useAuth();
  const [goals, setGoals] = useState(null);

  async function syncGoals() {
    const data = await getWeeklyGoals(token);
    setGoals(data);
  }

  useEffect(() => {
    if (token) {
      syncGoals();
    }
  }, [token]);

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
      <h2>Schedules</h2>

      <div className="grid-container">
        {days.map((dayGoals, dayIndex) => (
          <div key={dayIndex} className="grid-column">
            <h4 className="day-label">{dayNames[dayIndex]}</h4>

            {dayGoals.map((goal, index) => (
              <div
                key={index}
                className={`grid-item ${goal.status.replace(/\s+/g, "-").toLowerCase()}`}
              >
                <strong>{goal.name}</strong>
                <p>{goal.status}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SchedulesPage;
