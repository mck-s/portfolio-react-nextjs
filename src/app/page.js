"use client";
import React, { useEffect, useRef, useState } from "react";
import "./styles.css";
import FloatingMenu from "./FloatingMenu";
import ImageCarouselGrid from "./ImageCarouselGrid";
import Book from "./Book";
import { translations } from "./lang";
import { FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";
import { Laptop, Smartphone, ExternalLink } from "lucide-react";

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

const styles = {
  section: {
    padding: "60px 20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "40px",
    textAlign: "center",
    color: "#2c3e50",
  },
  projectGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
  },
  projectCard: {
    background: "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(8px)",
    borderRadius: "12px",
    padding: "30px",
    boxShadow:
      "0 4px 6px -1px rgba(74, 87, 89, 0.12), 0 2px 4px -1px rgba(74, 87, 89, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.35) inset",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "default",
  },
  iconContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  projectTitle: {
    fontSize: "1.5rem",
    marginBottom: "20px",
    textAlign: "center",
    color: "#2c3e50",
    fontWeight: "600",
  },
  projectsList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  projectItem: {
    paddingBottom: "20px",
    borderBottom: "1px solid #e0e0e0",
  },
  projectSubtitle: {
    fontSize: "1.1rem",
    marginBottom: "8px",
    color: "#34495e",
    fontWeight: "600",
  },
  projectDesc: {
    fontSize: "0.95rem",
    color: "#5a6c7d",
    lineHeight: "1.6",
    margin: "0",
  },
  appItem: {
    paddingBottom: "20px",
    borderBottom: "1px solid #e0e0e0",
  },
  appHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "8px",
  },
  appIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    objectFit: "cover",
  },
  appTitle: {
    fontSize: "1.1rem",
    color: "#34495e",
    fontWeight: "600",
    margin: "0",
  },
  storeLinks: {
    display: "flex",
    gap: "10px",
    marginTop: "12px",
    flexWrap: "wrap",
  },
  linkIcon: {
    display: "inline-block",
    verticalAlign: "middle",
  },
};

export default function Home() {
  const [lang, setLang] = useState("jp");
  const [showHero, setShowHero] = useState(false);
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

  return (
    <div className="App">
      <header className={`hero ${showHero ? "visible" : ""}`}>
        <div className="hero-content" />
      </header>

      <main>
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
                    .replaceAll(/[⚪︎◯・⚫︎]/g, ".")
                    .split(/[。．.]/)
                    .filter(Boolean)
                    .map((part, idx) => (
                      <span key={idx}>
                        {part}
                        {lang === "jp" ? "。" : "."}
                        <br />
                      </span>
                    ))}
                </p>
              </div>
            </section>
          )}
        </RevealOnScroll>

        <ImageCarouselGrid />

        <RevealOnScroll>
          {({ isVisible }) => (
            <section style={styles.section}>
              <h2 style={styles.title}>{t.projectsTitle}</h2>
              <div style={styles.projectGrid}>
                {/* Web Development Card */}
                <div style={styles.projectCard}>
                  <div style={styles.iconContainer}>
                    <Laptop size={64} color="#4a5759" strokeWidth={1.5} />
                  </div>
                  <h3 style={styles.projectTitle}>{t.projectsWebDevTitle}</h3>
                  <div style={styles.projectsList}>
                    {[1, 2, 3].map((num) => (
                      <div key={num} style={styles.projectItem}>
                        <h4 style={styles.projectSubtitle}>
                          {t[`project${num}Title`]}
                        </h4>
                        <p style={styles.projectDesc}>
                          {t[`project${num}Desc`]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile Apps Card */}
                <div style={styles.projectCard}>
                  <div style={styles.iconContainer}>
                    <Smartphone size={64} color="#4a5759" strokeWidth={1.5} />
                  </div>
                  <h3 style={styles.projectTitle}>
                    {t.projectsMobileDevTitle}
                  </h3>
                  <div style={styles.projectsList}>
                    {/* ari App */}
                    <div style={styles.appItem}>
                      <div style={styles.appHeader}>
                        <img
                          src="/ari.png"
                          alt="ari app icon"
                          style={styles.appIcon}
                        />
                        <h4 style={styles.appTitle}>{t.ariTitle}</h4>
                      </div>
                      <p style={styles.projectDesc}>{t.ariDesc}</p>
                      <div style={styles.storeLinks}>
                        <a
                          href="https://apps.apple.com/us/app/baby-logger-ari/id6755410244"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="store-button store-button--active"
                        >
                          App Store{" "}
                          <ExternalLink size={14} style={styles.linkIcon} />
                        </a>
                        <a
                          href="https://play.google.com/store/apps/details?id=com.mck.ari"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="store-button store-button--active"
                        >
                          Play Store{" "}
                          <ExternalLink size={14} style={styles.linkIcon} />
                        </a>
                      </div>
                    </div>

                    {/* Moji App */}
                    <div style={styles.appItem}>
                      <div style={styles.appHeader}>
                        <img
                          src="/moji.png"
                          alt="moji app icon"
                          style={styles.appIcon}
                        />
                        <h4 style={styles.appTitle}>{t.mojiTitle}</h4>
                      </div>
                      <p style={styles.projectDesc}>{t.mojiDesc}</p>
                      <div style={styles.storeLinks}>
                        <a
                          href="https://apps.apple.com/jp/app/moji-day/id6755624514"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="store-button store-button--active"
                        >
                          App Store{" "}
                          <ExternalLink size={14} style={styles.linkIcon} />
                        </a>
                        <a
                          href="https://play.google.com/store/apps/details?id=com.moji"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="store-button store-button--disabled"
                        >
                          Play Store{" "}
                          <ExternalLink size={14} style={styles.linkIcon} />
                        </a>
                      </div>
                    </div>

                    <div style={styles.appItem}>
                      <div style={styles.appHeader}>
                        <h4 style={styles.appTitle}>{t.clientAppsTitle}</h4>
                      </div>
                      <p style={styles.projectDesc}>{t.clientAppsDesc}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </RevealOnScroll>

        <section id="skills-section" className="section">
          <h2>{t.skillsTitle}</h2>
          <div className="skills-grid">
            {["skill1", "skill2", "skill3"].map((key, index) => (
              <RevealOnScroll key={key}>
                {({ isVisible }) => (
                  <div className="skill-category">
                    <div
                      className={`skill-title-wrapper ${
                        isVisible ? "visible" : ""
                      }`}
                    >
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
                          style={{
                            animationDelay: `${0.4 + itemIndex * 0.2}s`,
                          }}
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

        <RevealOnScroll>
          {({ isVisible }) => (
            <section className="section">
              <h2>{t.passionTitle}</h2>
              <div className="passion-image-wrapper">
                <Book />
              </div>
              <p className="passion-description">
                {t.passionText
                  .split(/[。\.]/)
                  .filter(Boolean)
                  .map((part, idx) => (
                    <span key={idx}>
                      {part.trim()}
                      {lang === "jp" ? "。" : "."}
                      <br />
                    </span>
                  ))}
              </p>
            </section>
          )}
        </RevealOnScroll>

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
