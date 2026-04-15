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
      { threshold: 0.2 },
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
    borderRadius: "0px",
    padding: "30px",
    boxShadow: "none",
    transition: "transform 0.3s ease",
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
  const [notePosts, setNotePosts] = useState([]);
  const [noteError, setNoteError] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    const timer = setTimeout(() => setShowHero(true), 100);
    document.body.classList.add("loaded");
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const load = async () => {
      try {
        const res = await fetch("/api/note", { signal: controller.signal });
        if (!res.ok) throw new Error("Failed to load note feed");
        const data = await res.json();
        if (!cancelled) {
          const items = Array.isArray(data.items) ? data.items : [];
          setNotePosts(items);
          setNoteError(items.length === 0);
        }
      } catch (error) {
        if (!cancelled) setNoteError(true);
      }
    };

    load();
    return () => {
      cancelled = true;
      controller.abort();
    };
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

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString(lang === "jp" ? "ja-JP" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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
                <p className="about-copy">
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
                <div className={`about-timeline ${isVisible ? "visible" : ""}`}>
                  {t.aboutTimeline.map((item, idx) => (
                    <div
                      key={`${item.year}-${idx}`}
                      className="about-timeline-item"
                      style={{ transitionDelay: `${idx * 140}ms` }}
                    >
                      <div className="about-timeline-marker" aria-hidden="true" />
                      <div className="about-timeline-year">{item.year}</div>
                      <p className="about-timeline-text">{item.text}</p>
                    </div>
                  ))}
                </div>
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
                    {[1, 2, 3, 4].map((num) => (
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

        <RevealOnScroll>
          {({ isVisible }) => (
            <section id="blog-section" className="section note-section">
              <div className="note-header">
                <a
                  href="https://note.com/makechan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="note-profile"
                >
                  <img src="/note.webp" alt="note profile" loading="lazy" />
                </a>
                <div className="note-header-text">
                  <h2>{t.blogTitle}</h2>
                  <p className="note-subtitle">{t.blogSubtitle}</p>
                </div>
              </div>

              {notePosts.length > 0 ? (
                <div className="note-grid">
                  {notePosts.map((post) => (
                    <a
                      key={post.link}
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`note-card ${isVisible ? "visible" : ""}`}
                    >
                      {post.thumbnail ? (
                        <div className="note-thumb">
                          <img
                            src={post.thumbnail}
                            alt={post.title}
                            loading="lazy"
                          />
                        </div>
                      ) : null}
                      <span className="note-title">{post.title}</span>
                      <span className="note-date">{formatDate(post.date)}</span>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="note-empty">
                  <p>{t.blogEmpty}</p>
                </div>
              )}

              <div className="company-blog-block">
                <div className="company-blog-header">
                  <h3>{t.companyBlogTitle}</h3>
                  <p className="company-blog-subtitle">{t.companyBlogSubtitle}</p>
                </div>
                <div className="company-blog-grid">
                  {t.companyBlogPosts.map((post) => (
                    <a
                      key={post.url}
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`company-blog-card ${isVisible ? "visible" : ""}`}
                    >
                      {post.image ? (
                        <div className="company-blog-thumb">
                          <img
                            src={post.image}
                            alt={post.title}
                            loading="lazy"
                          />
                        </div>
                      ) : null}
                      <span className="company-blog-domain">
                        tech.i3design.jp
                      </span>
                      <span className="company-blog-cta">
                        {t.companyBlogCta}{" "}
                        <ExternalLink size={14} style={styles.linkIcon} />
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {noteError && <div className="note-hint">{t.blogHint}</div>}
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
              <a
                href="https://lookforfuji.com"
                target="_blank"
                rel="noopener noreferrer"
                className="store-button store-button--active"
              >
                {t.passionLinkLabel}{" "}
                <ExternalLink size={14} style={styles.linkIcon} />
              </a>
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
        <p>© 2026 McK Schroeder. All rights reserved.</p>
      </footer>
    </div>
  );
}
