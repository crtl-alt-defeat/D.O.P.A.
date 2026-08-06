import { NavLink } from "react-router";
export default function Navbar() {
  // const { token, logout } = useAuth(); // uncomment when ready
  const token = false; // temporary so your app doesn't crash

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
            <button>Log out</button>
            <NavLink to="/profile">Profile</NavLink>
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
