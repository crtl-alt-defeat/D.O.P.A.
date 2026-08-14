import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import "./Schedules.css";

function SchedulesPage() {
  const { token } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getWeeksGoals() {
      try {
        const res = await fetch("/api/users/me/schedules", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Server error:", text);
          return;
        }

        const data = await res.json();
        setGoals(data);
      } catch (err) {
        console.error("Failed to load goals:", err);
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      getWeeksGoals();
    } else {
      setLoading(false);
    }
  }, [token]);

  if (loading) return <p>Loading schedules...</p>;

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
