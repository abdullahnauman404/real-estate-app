import React from "react";
import Layout from "../components/Layout";
import { api, getFileUrl } from "../lib/api";
import Modal from "../components/Modal";

export default function Certificates() {
  const [items, setItems] = React.useState([]);
  const [active, setActive] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      const res = await api.get("/certificates");
      setItems(res.data.items || []);
    })();
  }, []);

  return (
    <Layout>
      <h2 className="page-title">Certificates</h2>
      <p className="muted">Company certificates and registrations.</p>

      <div className="grid">
        {items.map((c) => (
          <div className="card cert-card" key={c._id}>
            <div className="cert-cover" onClick={() => setActive(c)}>
              <img src={getFileUrl(c.imageUrl)} alt={c.title} />
            </div>
            <div className="cert-body">
              <h4 className="clickable" onClick={() => setActive(c)}>{c.title}</h4>
              <div className="muted">{c.issuer || ""} {c.issueDate ? `• ${c.issueDate}` : ""}</div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={Boolean(active)} title={active?.title || "Certificate"} onClose={() => setActive(null)} width={900}>
        {active ? (
          <div className="center">
            <img className="img-max" src={getFileUrl(active.imageUrl)} alt={active.title} />
            {active.description ? <p className="mt-16">{active.description}</p> : null}
          </div>
        ) : null}
      </Modal>
    </Layout>
  );
}
