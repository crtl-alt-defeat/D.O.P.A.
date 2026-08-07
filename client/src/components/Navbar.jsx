import { NavLink } from "react-router";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { token, logout } = useAuth(); // uncomment when ready

  return (
    <header>
      <h1>
        <img id="logo-image" src="icon.png" />
        D.O.P.A
      </h1>

      <nav className="navbar">
        <NavLink to="/">Home</NavLink>

        {token ? (
          <>
            <NavLink to="/home" onClick={logout}>
              Log out
            </NavLink>
            <NavLink to="/settings">Settings</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/intake">Register</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
