import { useState } from "react";
import "./Navbar.css";
import { NavLink } from "react-router";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { token, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="navbar-header">
      <h1 className="navbar-title">
        <img id="logo-gif" src="../../public/Icon.gif" />
        {/* <img id="logo-gif" src="Icon.gif" /> */}
        D.O.P.A
      </h1>

      <nav className="navbar">
        <div className="dropdown">
          <button
            className="dropdown-toggle"
            onClick={() => setIsOpen(!isOpen)}
          >
            <img
              src={
                isOpen
                  ? "../../public/Dropdown_2.png"
                  : "../../public/Dropdown_1.png"
              }
              // src={isOpen ? "Dropdown_2.png" : "Dropdown_1.png"}
              alt="menu"
              className="menu-icon"
            />
            <span className="menu-label">Menu</span>
          </button>

          {isOpen && (
            <div className="dropdown-menu">
              {token ? (
                <>
                  <NavLink to="/home">Home</NavLink>
                  <NavLink to="/" onClick={logout}>
                    Log out
                  </NavLink>
                  <NavLink to="/settings">Settings</NavLink>
                  <NavLink to="/schedules">Schedules</NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/">Home</NavLink>
                  <NavLink to="/login">Login</NavLink>
                  <NavLink to="/intake">Register</NavLink>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
