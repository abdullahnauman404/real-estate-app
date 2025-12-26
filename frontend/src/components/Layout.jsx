import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getToken, setToken } from "../lib/auth";

export default function Layout({ children }) {
  const nav = useNavigate();
  const token = getToken();

  return (
    <div className="app">
      <header className="topbar">
        <Link to="/" className="brand">
          <i className="fas fa-building-columns" /> <span>RICHMOORESTATE</span>
        </Link>

        <nav className="topnav">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/maps">Maps</NavLink>
          <NavLink to="/certificates">Certificates</NavLink>
          <NavLink to="/admin">Admin</NavLink>
        </nav>

        <div className="topbar-actions">
          {token ? (
            <button
              className="btn btn-ghost"
              onClick={() => {
                setToken(null);
                nav("/admin");
              }}
            >
              Logout
            </button>
          ) : (
            <a className="btn btn-primary" href="#newsletter">Subscribe</a>
          )}
        </div>
      </header>

      <main className="container">{children}</main>

      <footer className="footer" id="newsletter">
        <div className="footer-grid">
          <div>
            <h3>RICHMOORESTATE & BUILDERS</h3>
            <p>Buy, sell & rent with confidence. Verified listings and fast support.</p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Properties</Link></li>
              <li><Link to="/maps">Maps</Link></li>
              <li><Link to="/certificates">Certificates</Link></li>
              <li><Link to="/admin">Admin Panel</Link></li>
            </ul>
          </div>
          <div>
            <h4>Newsletter</h4>
            <p>Get latest listings and updates.</p>
            <NewsletterForm />
          </div>
        </div>
        <div className="footer-bottom">© {new Date().getFullYear()} RICHMOORESTATE</div>
      </footer>
    </div>
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
    <form className="newsletter" onSubmit={onSubmit}>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        type="email"
        required
      />
      <button className="btn btn-primary" disabled={state.loading}>
        {state.loading ? "..." : "Subscribe"}
      </button>
      {state.msg ? <div className="hint">{state.msg}</div> : null}
    </form>
  );
}
