import React from "react";
import Layout from "../components/Layout";
import { api } from "../lib/api";
import { getToken, setToken } from "../lib/auth";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const nav = useNavigate();
  const [form, setForm] = React.useState({ username: "", password: "" });
  const [state, setState] = React.useState({ loading: false, msg: "" });

  React.useEffect(() => {
    if (getToken()) nav("/admin/dashboard");
  }, [nav]);

  async function submit(e) {
    e.preventDefault();
    setState({ loading: true, msg: "" });
    try {
      const res = await api.post("/auth/login", form);
      setToken(res.data.token);
      nav("/admin/dashboard");
    } catch (err) {
      setState({ loading: false, msg: err?.response?.data?.message || "Login failed" });
    }
  }

  return (
    <Layout>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="logo-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h2>Admin Portal</h2>
            <p>Authorized personnel access only</p>
          </div>

          <form className="auth-form" onSubmit={submit}>
            <div className="form-group-modern">
              <label>Username</label>
              <div className="input-with-icon">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  placeholder="Enter username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-group-modern">
              <label>Password</label>
              <div className="input-with-icon">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button className="btn-login-modern" disabled={state.loading}>
              {state.loading ? (
                <><i className="fas fa-circle-notch fa-spin"></i> Authenticating...</>
              ) : (
                <><i className="fas fa-sign-in-alt"></i> Login to Dashboard</>
              )}
            </button>

            {state.msg ? (
              <div className="auth-error">
                <i className="fas fa-exclamation-circle"></i> {state.msg}
              </div>
            ) : null}

            <a href="/" className="back-to-site">
              <i className="fas fa-arrow-left"></i> Back to Website
            </a>
          </form>

          <div className="auth-footer">
            <p>© {new Date().getFullYear()} RICHMOORESTATE & BUILDERS</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
