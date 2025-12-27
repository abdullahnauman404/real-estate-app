import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { getToken, setToken } from "../lib/auth";

export default function Layout({ children, hideFooter = false }) {
  const nav = useNavigate();
  const location = useLocation();
  const token = getToken();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1200 && mobileMenuOpen) {
        closeMobileMenu();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  // Handle hash scrolling
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Preloader component
  if (loading) {
    return (
      <div className="preloader">
        <div className="preloader-content">
          <div className="preloader-logo">
            <h1>RICHMOORESTATE</h1>
            <p>BUILDERS & DEVELOPERS</p>
          </div>
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
        </div>
      </div>
    );
  }

  // Simplified Link Helper for internal scroll links
  const ScrollLink = ({ to, children }) => (
    <a href={to} className="nav-link" onClick={closeMobileMenu}>
      {children}
    </a>
  );

  return (
    <>
      {/* Floating WhatsApp */}
      <a href="https://wa.me/923014463416" className="whatsapp-float" target="_blank" rel="noopener noreferrer">
        <i className="fab fa-whatsapp"></i>
      </a>

      {/* Navigation */}
      <nav className="navbar">
        <div className="container nav-container">
          <Link to="/" className="logo" onClick={closeMobileMenu}>
            {/* New Logo Logic */}
            <img src="/logo.jpg" alt="Richmoor Estate" style={{ height: 50, borderRadius: 5 }} />
            <div className="logo-text">
              <h1>RICHMOORESTATE</h1>
              <p>Premium Property Dealers</p>
            </div>
          </Link>

          <div className={`nav-menu ${mobileMenuOpen ? "active" : ""}`}>
            <div className="nav-links">
              <ScrollLink to="/"><i className="fas fa-home"></i> Home</ScrollLink>
              <ScrollLink to="/#properties"><i className="fas fa-building"></i> Properties</ScrollLink>
              <ScrollLink to="/#maps"><i className="fas fa-map"></i> Maps</ScrollLink>
              <ScrollLink to="/#certificates"><i className="fas fa-award"></i> Certificates</ScrollLink>
              <ScrollLink to="/#services"><i className="fas fa-concierge-bell"></i> Services</ScrollLink>
              <ScrollLink to="/#about"><i className="fas fa-info-circle"></i> About</ScrollLink>
              <ScrollLink to="/#contact"><i className="fas fa-phone-alt"></i> Contact</ScrollLink>
            </div>

            <div className="nav-actions">
              {token ? (
                <button
                  className="admin-btn"
                  style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem' }}
                  onClick={() => {
                    setToken(null);
                    closeMobileMenu();
                    nav("/admin");
                  }}
                >
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Logout</span>
                </button>
              ) : null}

              <button
                className="btn btn-primary"
                onClick={() => {
                  window.location.href = "mailto:richmoorestatebuilders@gmail.com";
                  closeMobileMenu();
                }}
              >
                <i className="fas fa-question-circle"></i> Quick Inquiry
              </button>
            </div>
          </div>

          <button
            className={`mobile-menu-btn ${mobileMenuOpen ? "active" : ""}`}
            onClick={toggleMobileMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      <main>{children}</main>

      {/* Footer */}
      {!hideFooter && (
        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-col">
                <div className="footer-logo">
                  <img src="/logo.jpg" alt="Richmoor Estate" style={{ height: 60, borderRadius: 5, marginBottom: 15 }} />
                  <div>
                    <h3>RICHMOORESTATE</h3>
                    <p>Premium Property Dealers</p>
                  </div>
                </div>
                <p>Your trusted partner for premium real estate solutions in Pakistan since 2008.</p>
                <div className="social-links">
                  <a href="#"><i className="fab fa-facebook-f"></i></a>
                  <a href="#"><i className="fab fa-twitter"></i></a>
                  <a href="#"><i className="fab fa-instagram"></i></a>
                  <a href="#"><i className="fab fa-linkedin-in"></i></a>
                </div>
              </div>

              <div className="footer-col">
                <h4>Quick Links</h4>
                <ul>
                  <li><a href="/">Home</a></li>
                  <li><a href="/#properties">Properties</a></li>
                  <li><a href="/#maps">Maps</a></li>
                  <li><a href="/#certificates">Certificates</a></li>
                  {/* <li><a href="/#services">Services</a></li> */}
                  {/* <li><a href="/#about">About Us</a></li> */}
                  <li><a href="/#contact">Contact</a></li>
                </ul>
              </div>

              <div className="footer-col">
                <h4>Property Cities</h4>
                <ul>
                  <li><a href="/?city=lahore">Lahore Properties</a></li>
                  <li><a href="/?city=islamabad">Islamabad Properties</a></li>
                  <li><a href="/?city=karachi">Karachi Properties</a></li>
                  <li><a href="/?city=rawalpindi">Rawalpindi Properties</a></li>
                  <li><a href="/?city=faisalabad">Faisalabad Properties</a></li>
                </ul>
              </div>

              <div className="footer-col">
                <h4>Newsletter</h4>
                <p>Subscribe for new property updates</p>
                <NewsletterForm />
              </div>
            </div>

            <div className="footer-bottom">
              <p>
                {/* The copyright symbol is the Admin login trigger */}
                <span
                  style={{ cursor: "pointer", userSelect: "none" }}
                  onClick={() => nav("/admin")}
                  title="Admin Login"
                >
                  &copy;
                </span>
                2024 RICHMOORESTATE & BUILDERS. All rights reserved.
              </p>
              <div className="footer-links">
                <Link to="/">Privacy Policy</Link>
                <Link to="/">Terms & Conditions</Link>
              </div>
            </div>
          </div>
        </footer>
      )}
    </>
  );
}

function NewsletterForm() {
  const [email, setEmail] = React.useState("");
  const [state, setState] = React.useState({ loading: false, msg: "" });

  async function onSubmit(e) {
    e.preventDefault();
    setState({ loading: true, msg: "" });
    try {
      const { api } = await import("../lib/api");
      await api.post("/subscribers", { email });
      setEmail("");
      setState({ loading: false, msg: "Subscribed successfully." });
    } catch (err) {
      setState({ loading: false, msg: err?.response?.data?.message || "Could not subscribe." });
    }
  }

  return (
    <>
      <form className="newsletter-form" onSubmit={onSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your Email"
          required
        />
        <button className="btn btn-primary" disabled={state.loading}>
          {state.loading ? "..." : "Subscribe"}
        </button>
      </form>
      {state.msg ? <p style={{ fontSize: '0.8rem', marginTop: '5px', color: '#f4a261' }}>{state.msg}</p> : null}
    </>
  );
}
