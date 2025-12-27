import React from "react";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import { api, getFileUrl } from "../lib/api";

export default function Maps() {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [active, setActive] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await api.get("/maps", { params: { page: 1, limit: 50 } });
        setItems(res.data.items || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Layout>
      <h2 className="page-title">Maps</h2>
      <p className="muted">View and download PDF maps (master plans, societies, layouts).</p>

      <div className="grid">
        {items.map((m) => (
          <div className="card map-card" key={m._id}>
            <div className="map-cover">
              {m.image ? <img src={getFileUrl(m.image)} alt={m.title} /> : <div className="placeholder">Map</div>}
            </div>
            <div className="map-body">
              <h4>{m.title}</h4>
              <p className="muted">{m.description}</p>
              <div className="actions">
                <button className="btn btn-primary" onClick={() => setActive(m)}>View</button>
                <a className="btn btn-ghost" href={getFileUrl(m.pdfUrl)} download={`${m.title.replace(/\s+/g, '_')}.pdf`} target="_blank" rel="noreferrer">
                  <i className="fas fa-download"></i> Download
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {loading ? <div className="center mt-24">Loading...</div> : null}

      <Modal open={Boolean(active)} title={active?.title || "Map"} onClose={() => setActive(null)} width={980}>
        {active ? (
          <div className="pdf-wrap">
            <iframe title="map" src={getFileUrl(active.pdfUrl)} />
          </div>
        ) : null}
      </Modal>
    </Layout>
  );
}
