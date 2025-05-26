"use client";
import React, { useEffect, useRef, useState } from "react";
import "./styles.css";
import FloatingMenu from "./FloatingMenu";
import { translations } from "./lang";
import { FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";
import { Laptop, Code, Settings } from "lucide-react";

// === RevealOnScroll ===
function RevealOnScroll({ children }) {
  const ref = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${isRevealed ? "visible" : ""}`}>
      {typeof children === "function"
        ? children({ isVisible: isRevealed })
        : children}
    </div>
  );
}

// === Home Page Component ===
export default function Home() {
  const [lang, setLang] = useState("jp");
  const [showHero, setShowHero] = useState(false);
  const [openStates, setOpenStates] = useState([false, false, false]);
  const t = translations[lang];

  useEffect(() => {
    const timer = setTimeout(() => setShowHero(true), 100);
    document.body.classList.add("loaded");
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        document.body.classList.add("scrolled");
      } else {
        document.body.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleOpen = (index) => {
    setOpenStates((prev) =>
      prev.map((v, i) => (i === index ? !v : v))
    );
  };

  return (
    <div className="App">
      <header className={`hero ${showHero ? "visible" : ""}`}>
        <div className="hero-content" />
      </header>

      <main>
        {/* About */}
        <RevealOnScroll>
          {({ isVisible }) => (
            <section id="about-section" className="section">
              <h2>{t.aboutTitle}</h2>
              <div className="about-content">
                <img
                  src="/mck.jpg"
                  alt="About"
                  className={`about-image ${isVisible ? "animate" : ""}`}
                />
                <p>
                  {t.aboutText
                    .split(/[。。\.]/)
                    .filter(Boolean)
                    .map((part, idx) => (
                      <span key={idx}>
                        {part}。<br />
                      </span>
                    ))}
                </p>
                {/* Carousel */}
                <div className="carousel-container">
                  <div className="carousel-track">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <div key={num} className="carousel-slide">
                        <img src={`/${num}.jpg`} alt={`carousel-${num}`} />
                      </div>
                    ))}
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <div key={`dup-${num}`} className="carousel-slide">
                        <img src={`/${num}.jpg`} alt={`carousel-duplicate-${num}`} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}
        </RevealOnScroll>

        {/* Skills */}
        <section id="skills-section" className="section">
          <h2>{t.skillsTitle}</h2>
          <div className="skills-grid">
            {["skill1", "skill2", "skill3"].map((key, index) => (
              <RevealOnScroll key={key}>
                {({ isVisible }) => (
                  <div className="skill-category">
                    <div className={`skill-title-wrapper ${isVisible ? "visible" : ""}`}>
                      <div className={`skill-title skill-color-${index}`}>
                        {t[`${key}Title`]}
                      </div>
                      {index === 2 && (
                        <a
                          href={t[`${key}Link`]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="read-more-btn"
                          style={{ animationDelay: `${0.5 + index * 0.2}s` }}
                        >
                          READ MORE ↗
                        </a>
                      )}
                    </div>
                    <div className="skill-items">
                      {[1, 2, 3].map((i, itemIndex) => (
                        <div
                          key={i}
                          className="skill-item"
                          style={{ animationDelay: `${0.4 + itemIndex * 0.2}s` }}
                        >
                          {t[`${key}Item${i}`]}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </RevealOnScroll>
            ))}
          </div>
        </section>

        {/* Projects */}
        <RevealOnScroll>
          {({ isVisible }) => (
            <section className="section">
              <h2>{t.projectsTitle}</h2>
              <div className="project-grid">
                {[1, 2, 3].map((num, index) => {
                  const title = t[`project${num}Title`];
                  const desc = t[`project${num}Desc`];
                  const iconComponents = {
                    1: <Laptop size={64} color="#4a5759" />,
                    2: <Code size={64} color="#4a5759" />,
                    3: <Settings size={64} color="#4a5759" />,
                  };

                  return (
                    <div key={num} className={`project-card ${openStates[index] ? "open" : ""}`}>
                      <div className="project-image">{iconComponents[num]}</div>
                      <div className="project-title" onClick={() => toggleOpen(index)}>
                        {title} <span className="chevron">{openStates[index] ? "▲" : "▼"}</span>
                      </div>
                      <div
                        className="project-body"
                        style={{ maxHeight: openStates[index] ? "300px" : "0" }}
                      >
                        <p className="project-description">{desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </RevealOnScroll>

        {/* Passion Project */}
        <RevealOnScroll>
          {({ isVisible }) => (
            <section className="section">
              <h2>{t.passionTitle}</h2>
              <div className={`passion-image-wrapper ${isVisible ? "animate" : ""}`}>
                <img src="/book.png" alt="Passion Project" className="passion-image" />
              </div>
              <p className="passion-description">
                {t.passionText
                  .split(/[。\.]/)
                  .filter(Boolean)
                  .map((part, idx) => (
                    <span key={idx}>{part.trim()}。<br /></span>
                  ))}
              </p>
            </section>
          )}
        </RevealOnScroll>

        {/* Contact */}
        <RevealOnScroll>
          <section id="contact-section" className="section">
            <FaMapMarkerAlt style={{ color: "black" }} />
            <br />
            <span>{t.contactText}</span>
            <br />
            <br />
            <FaEnvelope style={{ color: "black" }} />
            <br />
            <a href="mailto:mck-s@outlook.jp">mck-s@outlook.jp</a>
          </section>
        </RevealOnScroll>
      </main>

      <FloatingMenu lang={lang} setLang={setLang} />

      <footer className="footer">
        <p>© 2025 McK Schroeder. All rights reserved.</p>
      </footer>
    </div>
  );
}
