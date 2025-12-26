import React from "react";
import { Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import { api, getFileUrl } from "../lib/api";
import { getToken } from "../lib/auth";
import Modal from "../components/Modal";

const sections = [
  { key: "overview", label: "Dashboard", icon: "fa-tachometer-alt" },
  { key: "properties", label: "Manage Properties", icon: "fa-home" },
  { key: "add-property", label: "Add Property", icon: "fa-plus-circle" },
  { key: "maps", label: "Manage Maps", icon: "fa-map" },
  { key: "add-map", label: "Add Map", icon: "fa-plus" },
  { key: "certificates", label: "Manage Certificates", icon: "fa-award" },
  { key: "add-certificate", label: "Add Certificate", icon: "fa-plus" },
  { key: "inquiries", label: "Inquiries", icon: "fa-comments" },
  { key: "subscribers", label: "Subscribers", icon: "fa-users" },
];

export default function AdminDashboard() {
  const token = getToken();
  const [section, setSection] = React.useState("overview");
  const [stats, setStats] = React.useState(null);

  // lists
  const [properties, setProperties] = React.useState([]);
  const [maps, setMaps] = React.useState([]);
  const [certs, setCerts] = React.useState([]);
  const [inquiries, setInquiries] = React.useState([]);
  const [subs, setSubs] = React.useState([]);

  const [edit, setEdit] = React.useState(null); // {type, data}

  React.useEffect(() => {
    if (!token) return;
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function refreshAll() {
    const [s, p, m, c, i, su] = await Promise.all([
      api.get("/stats"),
      api.get("/properties", { params: { page: 1, limit: 200 } }),
      api.get("/maps", { params: { page: 1, limit: 200 } }),
      api.get("/certificates"),
      api.get("/inquiries"),
      api.get("/subscribers"),
    ]);
    setStats(s.data);
    setProperties(p.data.items || []);
    setMaps(m.data.items || []);
    setCerts(c.data.items || []);
    setInquiries(i.data.items || []);
    setSubs(su.data.items || []);
  }

  if (!token) return <Navigate to="/admin" replace />;

  return (
    <Layout>
      <div className="admin">
        <aside className="admin-side">
          <div className="admin-side-head">
            <div className="admin-title">
              <i className="fas fa-building-columns" />
              <div>
                <div className="t1">RICHMOORESTATE</div>
                <div className="muted">Admin Panel</div>
              </div>
            </div>
          </div>

          <div className="admin-menu">
            {sections.map((s) => (
              <button
                key={s.key}
                className={`admin-item ${section === s.key ? "active" : ""}`}
                onClick={() => setSection(s.key)}
              >
                <i className={`fas ${s.icon}`} />
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="admin-main">
          {section === "overview" ? <Overview stats={stats} /> : null}

          {section === "properties" ? (
            <EntityTable
              title="Properties"
              rows={properties}
              columns={[
                { key: "title", label: "Title" },
                { key: "city", label: "City" },
                { key: "purpose", label: "Purpose" },
                { key: "price", label: "Price" },
                { key: "status", label: "Status" },
              ]}
              onEdit={(row) => setEdit({ type: "property", data: row })}
              onDelete={async (row) => {
                if (!confirm("Delete this property?")) return;
                await api.delete(`/properties/${row._id}`);
                await refreshAll();
              }}
            />
          ) : null}

          {section === "add-property" ? (
            <PropertyForm
              onSaved={async () => { setSection("properties"); await refreshAll(); }}
            />
          ) : null}

          {section === "maps" ? (
            <EntityTable
              title="Maps"
              rows={maps}
              columns={[
                { key: "title", label: "Title" },
                { key: "category", label: "Category" },
                { key: "status", label: "Status" },
              ]}
              onEdit={(row) => setEdit({ type: "map", data: row })}
              onDelete={async (row) => {
                if (!confirm("Delete this map?")) return;
                await api.delete(`/maps/${row._id}`);
                await refreshAll();
              }}
            />
          ) : null}

          {section === "add-map" ? (
            <MapForm onSaved={async () => { setSection("maps"); await refreshAll(); }} />
          ) : null}

          {section === "certificates" ? (
            <EntityTable
              title="Certificates"
              rows={certs}
              columns={[
                { key: "title", label: "Title" },
                { key: "issuer", label: "Issuer" },
                { key: "status", label: "Status" },
              ]}
              onEdit={(row) => setEdit({ type: "certificate", data: row })}
              onDelete={async (row) => {
                if (!confirm("Delete this certificate?")) return;
                await api.delete(`/certificates/${row._id}`);
                await refreshAll();
              }}
              renderRight={(row) => row.imageUrl ? <a className="smalllink" href={getFileUrl(row.imageUrl)} target="_blank" rel="noreferrer">Image</a> : null}
            />
          ) : null}

          {section === "add-certificate" ? (
            <CertificateForm onSaved={async () => { setSection("certificates"); await refreshAll(); }} />
          ) : null}

          {section === "inquiries" ? (
            <InquiriesTable rows={inquiries} onChanged={refreshAll} />
          ) : null}

          {section === "subscribers" ? (
            <EntityTable
              title="Subscribers"
              rows={subs}
              columns={[{ key: "email", label: "Email" }, { key: "createdAt", label: "Date" }]}
              onDelete={async (row) => {
                if (!confirm("Delete subscriber?")) return;
                await api.delete(`/subscribers/${row._id}`);
                await refreshAll();
              }}
              hideEdit
            />
          ) : null}
        </section>
      </div>

      <Modal
        open={Boolean(edit)}
        title={edit?.type ? `Edit ${edit.type}` : "Edit"}
        onClose={() => setEdit(null)}
        width={820}
      >
        {edit?.type === "property" ? (
          <PropertyForm
            initial={edit.data}
            onSaved={async () => { setEdit(null); await refreshAll(); }}
          />
        ) : null}

        {edit?.type === "map" ? (
          <MapForm
            initial={edit.data}
            onSaved={async () => { setEdit(null); await refreshAll(); }}
          />
        ) : null}

        {edit?.type === "certificate" ? (
          <CertificateForm
            initial={edit.data}
            onSaved={async () => { setEdit(null); await refreshAll(); }}
          />
        ) : null}
      </Modal>
    </Layout>
  );
}

function Overview({ stats }) {
  return (
    <div>
      <h2 className="page-title">Dashboard</h2>
      <div className="stats">
        <Stat title="Properties" value={stats?.properties ?? "—"} icon="fa-home" />
        <Stat title="Maps" value={stats?.maps ?? "—"} icon="fa-map" />
        <Stat title="Certificates" value={stats?.certificates ?? "—"} icon="fa-award" />
        <Stat title="Inquiries" value={stats?.inquiries ?? "—"} icon="fa-comments" />
        <Stat title="Subscribers" value={stats?.subscribers ?? "—"} icon="fa-users" />
      </div>
      <div className="hint mt-16">
        Tip: Add properties, maps and certificates here — the main website updates automatically through the API.
      </div>
    </div>
  );
}

function Stat({ title, value, icon }) {
  return (
    <div className="card stat">
      <div className="stat-icon"><i className={`fas ${icon}`} /></div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="muted">{title}</div>
      </div>
    </div>
  );
}

function EntityTable({ title, rows, columns, onEdit, onDelete, hideEdit=false, renderRight }) {
  return (
    <div>
      <h2 className="page-title">{title}</h2>
      <div className="card table">
        <div className="table-head">
          <div className="muted">{rows.length} items</div>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                {columns.map((c) => <th key={c.key}>{c.label}</th>)}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r._id}>
                  {columns.map((c) => (
                    <td key={c.key}>
                      {String(r[c.key] ?? "")}
                    </td>
                  ))}
                  <td className="td-actions">
                    {renderRight ? renderRight(r) : null}
                    {!hideEdit ? (
                      <button className="btn btn-ghost" onClick={() => onEdit?.(r)}>Edit</button>
                    ) : null}
                    <button className="btn btn-ghost danger" onClick={() => onDelete?.(r)}>Delete</button>
                  </td>
                </tr>
              ))}
              {!rows.length ? (
                <tr><td colSpan={columns.length+1} className="muted center">No data</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PropertyForm({ initial, onSaved }) {
  const isEdit = Boolean(initial?._id);
  const [form, setForm] = React.useState(() => ({
    title: initial?.title || "",
    location: initial?.location || "",
    city: initial?.city || "lahore",
    type: initial?.type || "house",
    purpose: initial?.purpose || "sale",
    price: initial?.price || 0,
    area: initial?.area || 0,
    bedrooms: initial?.bedrooms || 0,
    bathrooms: initial?.bathrooms || 0,
    description: initial?.description || "",
    contactPhone: initial?.contactPhone || "",
    status: initial?.status || "active",
  }));
  const [files, setFiles] = React.useState([]);
  const [keepImages, setKeepImages] = React.useState(initial?.images || []);
  const [state, setState] = React.useState({ loading: false, msg: "" });

  async function submit(e) {
    e.preventDefault();
    setState({ loading: true, msg: "" });
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k, String(v)));
      fd.append("keepImages", JSON.stringify(keepImages));
      for (const f of files) fd.append("images", f);

      if (isEdit) await api.put(`/properties/${initial._id}`, fd);
      else await api.post("/properties", fd);

      setFiles([]);
      setState({ loading: false, msg: "Saved." });
      onSaved?.();
    } catch (err) {
      setState({ loading: false, msg: err?.response?.data?.message || "Failed." });
    }
  }

  return (
    <form className="form" onSubmit={submit}>
      <div className="grid2">
        <Field label="Title" value={form.title} onChange={(v)=>setForm({...form,title:v})} required />
        <Field label="Location" value={form.location} onChange={(v)=>setForm({...form,location:v})} required />
        <Field label="City" as="select" value={form.city} onChange={(v)=>setForm({...form,city:v})}>
          <option value="lahore">Lahore</option>
          <option value="karachi">Karachi</option>
          <option value="islamabad">Islamabad</option>
          <option value="rawalpindi">Rawalpindi</option>
        </Field>
        <Field label="Type" as="select" value={form.type} onChange={(v)=>setForm({...form,type:v})}>
          <option value="villa">Villa</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="plot">Plot</option>
          <option value="commercial">Commercial</option>
        </Field>
        <Field label="Purpose" as="select" value={form.purpose} onChange={(v)=>setForm({...form,purpose:v})}>
          <option value="sale">Sale</option>
          <option value="rent">Rent</option>
        </Field>
        <Field label="Status" as="select" value={form.status} onChange={(v)=>setForm({...form,status:v})}>
          <option value="active">Active</option>
          <option value="sold">Sold</option>
          <option value="rented">Rented</option>
          <option value="inactive">Inactive</option>
        </Field>
        <Field label="Price (PKR)" type="number" value={form.price} onChange={(v)=>setForm({...form,price:Number(v)})} required />
        <Field label="Area (sq.ft)" type="number" value={form.area} onChange={(v)=>setForm({...form,area:Number(v)})} />
        <Field label="Bedrooms" type="number" value={form.bedrooms} onChange={(v)=>setForm({...form,bedrooms:Number(v)})} />
        <Field label="Bathrooms" type="number" value={form.bathrooms} onChange={(v)=>setForm({...form,bathrooms:Number(v)})} />
        <Field label="Contact Phone" value={form.contactPhone} onChange={(v)=>setForm({...form,contactPhone:v})} />
      </div>

      <div className="row">
        <label>Description</label>
        <textarea rows="5" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} required />
      </div>

      {keepImages?.length ? (
        <div className="row">
          <label>Existing Images</label>
          <div className="chips">
            {keepImages.map((img) => (
              <div className="chip" key={img}>
                <a href={getFileUrl(img)} target="_blank" rel="noreferrer">view</a>
                <button type="button" className="chip-x" onClick={() => setKeepImages(keepImages.filter((x)=>x!==img))}>×</button>
              </div>
            ))}
          </div>
          <div className="hint">Removing here will remove them from the property gallery.</div>
        </div>
      ) : null}

      <div className="row">
        <label>Upload Images</label>
        <input type="file" multiple accept="image/*" onChange={(e)=>setFiles(Array.from(e.target.files||[]))} />
      </div>

      <div className="actions">
        <button className="btn btn-primary" disabled={state.loading}>
          {state.loading ? "Saving..." : (isEdit ? "Update Property" : "Create Property")}
        </button>
      </div>
      {state.msg ? <div className="hint">{state.msg}</div> : null}
    </form>
  );
}

function MapForm({ initial, onSaved }) {
  const isEdit = Boolean(initial?._id);
  const [form, setForm] = React.useState(() => ({
    title: initial?.title || "",
    description: initial?.description || "",
    category: initial?.category || "general",
    tags: (initial?.tags || []).join(", "),
    pdfUrl: initial?.pdfUrl && /^https?:\/\//i.test(initial.pdfUrl) ? initial.pdfUrl : "",
    image: initial?.image && /^https?:\/\//i.test(initial.image) ? initial.image : "",
    size: initial?.size || "",
    status: initial?.status || "active",
  }));
  const [pdfFile, setPdfFile] = React.useState(null);
  const [coverFile, setCoverFile] = React.useState(null);
  const [state, setState] = React.useState({ loading: false, msg: "" });

  async function submit(e) {
    e.preventDefault();
    setState({ loading: true, msg: "" });
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k, String(v)));
      if (pdfFile) fd.append("pdf", pdfFile);
      if (coverFile) fd.append("cover", coverFile);

      if (isEdit) await api.put(`/maps/${initial._id}`, fd);
      else await api.post("/maps", fd);

      setState({ loading: false, msg: "Saved." });
      onSaved?.();
    } catch (err) {
      setState({ loading: false, msg: err?.response?.data?.message || "Failed." });
    }
  }

  return (
    <form className="form" onSubmit={submit}>
      <Field label="Title" value={form.title} onChange={(v)=>setForm({...form,title:v})} required />
      <div className="row">
        <label>Description</label>
        <textarea rows="4" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} />
      </div>
      <div className="grid2">
        <Field label="Category" value={form.category} onChange={(v)=>setForm({...form,category:v})} />
        <Field label="Tags (comma separated)" value={form.tags} onChange={(v)=>setForm({...form,tags:v})} />
        <Field label="Size (e.g., 2.3 MB)" value={form.size} onChange={(v)=>setForm({...form,size:v})} />
        <Field label="Status" as="select" value={form.status} onChange={(v)=>setForm({...form,status:v})}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Field>
      </div>

      <div className="grid2">
        <div className="row">
          <label>PDF file (upload)</label>
          <input type="file" accept="application/pdf" onChange={(e)=>setPdfFile(e.target.files?.[0] || null)} />
          <div className="hint">OR provide external PDF URL below.</div>
        </div>
        <div className="row">
          <label>Cover image (upload)</label>
          <input type="file" accept="image/*" onChange={(e)=>setCoverFile(e.target.files?.[0] || null)} />
          <div className="hint">OR provide external cover URL below.</div>
        </div>
      </div>

      <div className="grid2">
        <Field label="External PDF URL (optional)" value={form.pdfUrl} onChange={(v)=>setForm({...form,pdfUrl:v})} />
        <Field label="External cover URL (optional)" value={form.image} onChange={(v)=>setForm({...form,image:v})} />
      </div>

      <div className="actions">
        <button className="btn btn-primary" disabled={state.loading}>
          {state.loading ? "Saving..." : (isEdit ? "Update Map" : "Create Map")}
        </button>
      </div>
      {state.msg ? <div className="hint">{state.msg}</div> : null}
    </form>
  );
}

function CertificateForm({ initial, onSaved }) {
  const isEdit = Boolean(initial?._id);
  const [form, setForm] = React.useState(() => ({
    title: initial?.title || "",
    issuer: initial?.issuer || "",
    issueDate: initial?.issueDate || "",
    description: initial?.description || "",
    imageUrl: initial?.imageUrl && /^https?:\/\//i.test(initial.imageUrl) ? initial.imageUrl : "",
    status: initial?.status || "active",
  }));
  const [imageFile, setImageFile] = React.useState(null);
  const [state, setState] = React.useState({ loading: false, msg: "" });

  async function submit(e) {
    e.preventDefault();
    setState({ loading: true, msg: "" });
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k, String(v)));
      if (imageFile) fd.append("image", imageFile);

      if (isEdit) await api.put(`/certificates/${initial._id}`, fd);
      else await api.post("/certificates", fd);

      setState({ loading: false, msg: "Saved." });
      onSaved?.();
    } catch (err) {
      setState({ loading: false, msg: err?.response?.data?.message || "Failed." });
    }
  }

  return (
    <form className="form" onSubmit={submit}>
      <div className="grid2">
        <Field label="Title" value={form.title} onChange={(v)=>setForm({...form,title:v})} required />
        <Field label="Issuer" value={form.issuer} onChange={(v)=>setForm({...form,issuer:v})} />
        <Field label="Issue Date" value={form.issueDate} onChange={(v)=>setForm({...form,issueDate:v})} placeholder="e.g., 2024-06-01" />
        <Field label="Status" as="select" value={form.status} onChange={(v)=>setForm({...form,status:v})}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Field>
      </div>

      <div className="row">
        <label>Description</label>
        <textarea rows="4" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} />
      </div>

      <div className="grid2">
        <div className="row">
          <label>Upload Image</label>
          <input type="file" accept="image/*" onChange={(e)=>setImageFile(e.target.files?.[0] || null)} />
          <div className="hint">OR provide external image URL.</div>
        </div>
        <Field label="External Image URL (optional)" value={form.imageUrl} onChange={(v)=>setForm({...form,imageUrl:v})} />
      </div>

      <div className="actions">
        <button className="btn btn-primary" disabled={state.loading}>
          {state.loading ? "Saving..." : (isEdit ? "Update Certificate" : "Create Certificate")}
        </button>
      </div>
      {state.msg ? <div className="hint">{state.msg}</div> : null}
    </form>
  );
}

function InquiriesTable({ rows, onChanged }) {
  return (
    <div>
      <h2 className="page-title">Inquiries</h2>
      <div className="card table">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Property</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Source</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r._id}>
                  <td>{new Date(r.createdAt).toLocaleString()}</td>
                  <td>{r.propertyTitle || "—"}</td>
                  <td>{r.name}</td>
                  <td>{r.phone}</td>
                  <td>{r.source}</td>
                  <td>
                    <select
                      value={r.status}
                      onChange={async (e) => {
                        await api.patch(`/inquiries/${r._id}/status`, { status: e.target.value });
                        await onChanged();
                      }}
                    >
                      <option value="new">new</option>
                      <option value="contacted">contacted</option>
                      <option value="closed">closed</option>
                    </select>
                  </td>
                  <td className="td-actions">
                    <button className="btn btn-ghost" onClick={() => alert(r.message)}>Message</button>
                    <button className="btn btn-ghost danger" onClick={async () => {
                      if (!confirm("Delete inquiry?")) return;
                      await api.delete(`/inquiries/${r._id}`);
                      await onChanged();
                    }}>Delete</button>
                  </td>
                </tr>
              ))}
              {!rows.length ? <tr><td colSpan={7} className="muted center">No inquiries</td></tr> : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, as="input", required=false, type="text", placeholder, children }) {
  return (
    <div className="row">
      <label>{label}{required ? " *" : ""}</label>
      {as === "select" ? (
        <select value={value} onChange={(e)=>onChange(e.target.value)}>
          {children}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e)=>onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
