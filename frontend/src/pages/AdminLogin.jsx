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
      <div className="auth">
        <div className="card auth-card">
          <h2>Admin Login</h2>
          <p className="muted">Login to manage properties, maps, certificates and inquiries.</p>
          <form className="form" onSubmit={submit}>
            <div className="row">
              <label>Username</label>
              <input value={form.username} onChange={(e)=>setForm({...form, username:e.target.value})} required />
            </div>
            <div className="row">
              <label>Password</label>
              <input type="password" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} required />
            </div>
            <button className="btn btn-primary" disabled={state.loading}>
              {state.loading ? "Logging in..." : "Login"}
            </button>
            {state.msg ? <div className="hint">{state.msg}</div> : null}
          </form>
        </div>
      </div>
    </Layout>
  );
}
