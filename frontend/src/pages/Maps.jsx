export default function Maps() {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [active, setActive] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await api.get("/maps", { params: { page: 1, limit: 50, status: 'active' } });
        setItems(res.data.items || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Layout>
      <div className="container" style={{ paddingTop: 120, paddingBottom: 60 }}>
        <h2 className="page-title">Property Maps</h2>
        <p className="muted" style={{ marginBottom: 40 }}>View and download detailed PDF maps of housing schemes and projects.</p>

        <div className="maps-grid">
          {items.map((m) => (
            <div className="map-card" key={m._id}>
              <div className="map-image-container">
                {m.image ? <img src={getFileUrl(m.image)} className="map-image" alt={m.title} /> : <div className="placeholder">Map</div>}
                <span className="map-badge">PDF</span>
              </div>
              <div className="map-info">
                <h3 className="map-title">{m.title}</h3>
                <p className="map-description">{m.description || "Housing scheme map with complete details."}</p>
                <div className="map-details">
                  <span className="map-size"><i className="fas fa-file-pdf"></i> MAP VIEW</span>
                  <div className="map-actions">
                    <button className="map-view-btn" onClick={() => setActive(m)}>
                      <i className="fas fa-eye"></i> View
                    </button>
                    <a
                      className="map-download-btn"
                      href={getFileUrl(m.pdfUrl)}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => {
                        // If it's a local file, we might need to force download if the server doesn't send correct headers
                        // but target="_blank" is safer for PDFs across browsers.
                      }}
                    >
                      <i className="fas fa-download"></i> Download
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!items.length && !loading && (
          <div className="empty-state">
            <i className="fas fa-map"></i>
            <h3>No Maps Found</h3>
            <p>Our maps database is being updated. Please check back later.</p>
          </div>
        )}

        {loading ? <div className="center mt-24">Loading Maps...</div> : null}
      </div>

      <Modal open={Boolean(active)} title={active?.title || "Map Viewer"} onClose={() => setActive(null)} width={1100}>
        {active ? (
          <div className="pdf-viewer-container" style={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
            <p className="muted" style={{ marginBottom: 10 }}>If the viewer doesn't load, <a href={getFileUrl(active.pdfUrl)} target="_blank" rel="noreferrer" style={{ color: 'var(--secondary)', fontWeight: 600 }}>click here to open the PDF directly</a>.</p>
            <iframe
              title="pdf-viewer"
              src={`${getFileUrl(active.pdfUrl)}#toolbar=0`}
              style={{ width: '100%', flex: 1, border: 'none', borderRadius: 8 }}
            />
          </div>
        ) : null}
      </Modal>
    </Layout>
  );
}
