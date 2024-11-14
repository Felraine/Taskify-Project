import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/images/Logo.png";
import notif from "../../assets/images/bell.png";
import lightMode from "../../assets/images/brightness.png";
import darkMode from "../../assets/images/moon.png";
import defaultProfile from "../../assets/images/JohnDoe.png";
import settingsIcon from "../../assets/images/settings.png";

const Navbar = ({ theme, setTheme }) => {
  const toggle_mode = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const showReminderPrompt = () => {
    alert("You have a reminder");
  };

  const username = localStorage.getItem("username") || "User";

  return (
    <div className={`navbar ${theme}`}>
      <div className="logoAndName">
        <Link to="/home">
          <img src={logo} alt="logo" className="logo" />
        </Link>
        <span className="appName">Taskify</span>
      </div>

      <div className="rightArea">
        <img src={defaultProfile} alt="profile" className="profilePicture" />
        <span className="accountName">{username}</span>

        <div className="notif" onClick={showReminderPrompt}>
          <img src={notif} alt="notification" className="notifIcon" />
        </div>

        <div className="lightMode">
          <img
            onClick={toggle_mode}
            src={theme === "light" ? lightMode : darkMode}
            alt="mode toggle"
            className="lightModeIcon"
          />
        </div>

        <div className="settings">
          <img src={settingsIcon} alt="settings" className="settingsIcon" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
