// FloatingMenu.jsx
import React, { useEffect, useState } from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import "./FloatingMenu.css";

const FloatingMenu = ({ lang, setLang }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const about = document.getElementById("about-section");
      if (!about) return;

      const rect = about.getBoundingClientRect();
      if (rect.top <= window.innerHeight) setIsVisible(true);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleToggle = () => {
    setLang(lang === "en" ? "jp" : "en");
  };

  return (
    <div className={`floating-menu ${isVisible ? "show" : ""}`}>
      <a
        href="https://www.linkedin.com/in/your-profile"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaLinkedin className="linkedin-icon" />
      </a>

      <a
        href="https://github.com/mck-s"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaGithub className="github-icon" />
      </a>

      <div className="toggle-wrapper" onClick={handleToggle}>
        <div className={`toggle-button ${lang === "en" ? "en" : "jp"}`}>
          {lang === "en" ? "EN" : "JP"}
        </div>
      </div>
    </div>
  );
};

export default FloatingMenu;
