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
              <i className="fas fa-user-shield"></i>
            </div>
            <h2>Admin Portal</h2>
            <p className="muted">Secure access to management dashboard</p>
          </div>
          
          <form className="auth-form" onSubmit={submit}>
            <div className="form-group-modern">
              <label>Username</label>
              <div className="input-with-icon">
                <i className="fas fa-user"></i>
                <input 
                  type="text"
                  placeholder="Enter your username"
                  value={form.username} 
                  onChange={(e)=>setForm({...form, username:e.target.value})} 
                  required 
                />
              </div>
            </div>
            
            <div className="form-group-modern">
              <label>Password</label>
              <div className="input-with-icon">
                <i className="fas fa-lock"></i>
                <input 
                  type="password" 
                  placeholder="Enter your password"
                  value={form.password} 
                  onChange={(e)=>setForm({...form, password:e.target.value})} 
                  required 
                />
              </div>
            </div>
            
            <button className="btn btn-primary btn-block" disabled={state.loading}>
              {state.loading ? (
                <><i className="fas fa-spinner fa-spin"></i> Authenticating...</>
              ) : (
                <><i className="fas fa-sign-in-alt"></i> Access Dashboard</>
              )}
            </button>
            
            {state.msg ? <div className="auth-error">{state.msg}</div> : null}
          </form>
          
          <div className="auth-footer">
            <p>© 2025 RICHMOORESTATE & BUILDERS. All rights reserved.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
