import { useEffect, useState } from "react";
import "./Navbar.css";
import { NavLink } from "react-router";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { token, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const gifStill =
    "https://github.com/crtl-alt-defeat/D.O.P.A./blob/main/client/public/Logo.png?raw=true";
  const gifOnce =
    "https://github.com/crtl-alt-defeat/D.O.P.A./blob/main/client/public/Checkmark_Animation.gif?raw=true";
  const gifAnimated =
    "https://github.com/crtl-alt-defeat/D.O.P.A./blob/main/client/public/Icon.gif?raw=true";
  const [gifSrc, setGifSrc] = useState(gifStill);

  const dropdown1 =
    "https://github.com/crtl-alt-defeat/D.O.P.A./blob/main/client/public/Dropdown_1.png?raw=true";
  const dropdown2 =
    "https://github.com/crtl-alt-defeat/D.O.P.A./blob/main/client/public/Dropdown_2.png?raw=true";

  useEffect(() => {
    setGifSrc(gifOnce);
  }, []);

  const hover = () => {
    setGifSrc(gifAnimated);
  };

  const noHover = () => {
    setGifSrc(gifStill);
  };

  return (
    <header className="navbar-header">
      <h1 className="navbar-title">
        <div
          className="logo-wrapper"
          onMouseEnter={hover}
          onMouseLeave={noHover}
        >
          <img id="logo-gif" src={gifSrc} alt="logo" />
        </div>
        D.O.P.A
      </h1>

      <nav className="navbar">
        <div className="dropdown">
          <button
            className="dropdown-toggle"
            onClick={() => setIsOpen(!isOpen)}
          >
            <img
              src={isOpen ? dropdown2 : dropdown1}
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
