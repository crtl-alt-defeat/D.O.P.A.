import "./auth.css";

import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { getTypeByName } from "../api/types";

function RegisterPage() {
  const { register, addSelectedType } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [sectionResults, setSectionResults] = useState([]);
  const [accountMade, setAccountMade] = useState(false);

  async function getResults() {
    const stored = JSON.parse(localStorage.getItem("sectionResults"));
    if (stored) {
      setSectionResults(stored);
      console.log("Imported section results:", stored);
    }
  }

  useEffect(() => {
    getResults();
  }, []);

  useEffect(() => {
    if (accountMade) {
      handleAddSelectedTypes();
    }
  }, [accountMade]);

  async function handleRegister(formData) {
    setError(null);

    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      await register(name, email, password);
      setAccountMade(true);
    } catch (e) {
      console.error(e);
      setError(e.message);
    }
  }

  async function handleAddSelectedTypes() {
    try {
      const types = [
        await getTypeByName("self care"),
        await getTypeByName("household"),
        await getTypeByName("work/school"),
        await getTypeByName("relationship"),
      ];

      console.log(types);

      for (let i = 0; i < types.length; i++) {
        const type = types[i];
        const result = sectionResults[i];
        console.log(type, result);

        if (result) {
          await addSelectedType(type.id);
          console.log("- added");
        }
      }

      navigate("/home");
    } catch (e) {
      console.error(e);
      setError(e.message);
    }
  }

  return (
    <div>
      <h2>Create an Account</h2>
      <p>Survey Results: {JSON.stringify(sectionResults)}</p>

      <form action={handleRegister}>
        <p>
          <label>
            Name:
            <input type="text" name="name" placeholder="Your Name" required />
          </label>
        </p>
        <p>
          <label>
            Email:
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
            />
          </label>
        </p>
        <p>
          <label>
            Password:
            <input
              type="password"
              name="password"
              placeholder="Your Password"
              required
            />
          </label>
        </p>
        <button type="submit">Submit & Continue</button>
        {error && <p role="alert">{error}</p>}
      </form>
    </div>
  );
}

export default RegisterPage;
