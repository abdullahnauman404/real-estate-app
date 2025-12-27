import React from "react";
import Layout from "../components/Layout";
import PropertyCard from "../components/PropertyCard";
import Modal from "../components/Modal";
import { api, getFileUrl } from "../lib/api";

const FAV_KEY = "richmoore_favorites";

export default function Home() {
  const [items, setItems] = React.useState([]);
  const [maps, setMaps] = React.useState([]);
  const [certs, setCerts] = React.useState([]);

  const [query, setQuery] = React.useState({ q: "", city: "", type: "", purpose: "", sort: "newest", priceRange: "" });
  const [loading, setLoading] = React.useState(false);

  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(null);
  const [activeImgIdx, setActiveImgIdx] = React.useState(0);

  const [fav, setFav] = React.useState(() => new Set(JSON.parse(localStorage.getItem(FAV_KEY) || "[]")));

  const [inquiryOpen, setInquiryOpen] = React.useState(false);
  const [inquiryMode, setInquiryMode] = React.useState("inquiry");

  React.useEffect(() => {
    loadProperties();
    loadExtras();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.city, query.type, query.purpose, query.sort, query.priceRange]);

  async function loadProperties() {
    setLoading(true);
    try {
      const res = await api.get("/properties", { params: { ...query, page: 1, limit: 12, status: "active" } });
      setItems(res.data.items || []);
    } finally {
      setLoading(false);
    }
  }

  async function loadExtras() {
    try {
      const [m, c] = await Promise.all([
        api.get("/maps", { params: { limit: 8, status: "active" } }),
        api.get("/certificates", { params: { limit: 8, status: "active" } })
      ]);
      setMaps(m.data.items || []);
      setCerts(c.data.items || []);
    } catch (e) {
      console.error(e);
    }
  }

  function onSearch(e) {
    if (e) e.preventDefault();
    loadProperties();
  }

  function toggleFav(item) {
    const next = new Set(fav);
    const id = item._id;
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setFav(next);
    localStorage.setItem(FAV_KEY, JSON.stringify(Array.from(next)));
  }

  function openDetails(item) {
    setActive(item);
    setActiveImgIdx(0);
    setOpen(true);
  }

  function openInquiry(mode) {
    setInquiryMode(mode);
    setInquiryOpen(true);
  }

  // Helper handling specific filter button clicks
  const handleFilterClick = (type, value) => {
    let newQuery = { ...query };
    if (type === 'all') {
      newQuery = { ...newQuery, purpose: "", type: "" };
    } else if (type === 'sale' || type === 'rent') {
      newQuery = { ...newQuery, purpose: type };
    } else {
      newQuery = { ...newQuery, type: value };
    }
    setQuery(newQuery);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Find Your <span className="highlight">Dream Property</span> in Pakistan</h1>
            <p className="hero-subtitle">Premium residential and commercial properties across Lahore, Islamabad, Karachi, and other major cities</p>

            {/* Real Search Form */}
            <div className="search-form-real">
              <div className="search-row">
                <div className="search-group">
                  <label><i className="fas fa-map-marker-alt"></i> City</label>
                  <select id="searchCity" value={query.city} onChange={(e) => setQuery({ ...query, city: e.target.value })}>
                    <option value="">Select City</option>
                    <option value="lahore">Lahore</option>
                    <option value="islamabad">Islamabad</option>
                    <option value="karachi">Karachi</option>
                    <option value="rawalpindi">Rawalpindi</option>
                    <option value="faisalabad">Faisalabad</option>
                  </select>
                </div>

                <div className="search-group">
                  <label><i className="fas fa-home"></i> Property Type</label>
                  <select id="searchPropertyType" value={query.type} onChange={(e) => setQuery({ ...query, type: e.target.value })}>
                    <option value="">All Types</option>
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="plot">Plot</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>

                <div className="search-group">
                  <label><i className="fas fa-tag"></i> Purpose</label>
                  <select id="searchPurpose" value={query.purpose} onChange={(e) => setQuery({ ...query, purpose: e.target.value })}>
                    <option value="">All</option>
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>

                <div className="search-group">
                  <label><i className="fas fa-money-bill-wave"></i> Price Range (Rs)</label>
                  <select id="searchPrice" value={query.priceRange} onChange={(e) => setQuery({ ...query, priceRange: e.target.value })}>
                    <option value="">Any Price</option>
                    <option value="low">Under 1 Crore</option>
                    <option value="mid">1 Crore - 5 Crore</option>
                    <option value="high">Above 5 Crore</option>
                  </select>
                </div>

                <button className="btn btn-primary search-btn" id="searchBtn" onClick={onSearch}>
                  <i className="fas fa-search"></i> Search
                </button>
              </div>
            </div>

            <div className="hero-stats">
              <div className="stat">
                <h3 id="totalPropertiesCount">{items.length > 5 ? items.length : "100+"}</h3>
                <p>Properties Listed</p>
              </div>
              <div className="stat">
                <h3>15+</h3>
                <p>Years Experience</p>
              </div>
              <div className="stat">
                <h3 id="soldPropertiesCount">500+</h3>
                <p>Properties Sold</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <i className="fas fa-home"></i>
              <div>
                <h3>Verified</h3>
                <p>All Properties Verified</p>
              </div>
            </div>
            <div className="stat-item">
              <i className="fas fa-file-contract"></i>
              <div>
                <h3>Legal</h3>
                <p>Complete Documentation</p>
              </div>
            </div>
            <div className="stat-item">
              <i className="fas fa-handshake"></i>
              <div>
                <h3>Trusted</h3>
                <p>500+ Happy Clients</p>
              </div>
            </div>
            <div className="stat-item">
              <i className="fas fa-clock"></i>
              <div>
                <h3>24/7</h3>
                <p>Customer Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Section */}
      <section className="properties-section" id="properties">
        <div className="container">
          <div className="section-header">
            <h2>Featured <span className="highlight">Properties</span></h2>
            <p>Premium properties available for sale and rent</p>
          </div>

          {/* Property Filters */}
          <div className="property-filters">
            <div className="filter-tabs">
              <button className={`filter-tab ${!query.purpose && !query.type ? "active" : ""}`} onClick={() => handleFilterClick('all')}>All Properties</button>
              <button className={`filter-tab ${query.purpose === 'sale' ? "active" : ""}`} onClick={() => handleFilterClick('sale')}>For Sale</button>
              <button className={`filter-tab ${query.purpose === 'rent' ? "active" : ""}`} onClick={() => handleFilterClick('rent')}>For Rent</button>
              <button className={`filter-tab ${query.type === 'plot' ? "active" : ""}`} onClick={() => handleFilterClick('plot', 'plot')}>Plots</button>
              <button className={`filter-tab ${query.type === 'commercial' ? "active" : ""}`} onClick={() => handleFilterClick('commercial', 'commercial')}>Commercial</button>
            </div>

            <div className="sort-options">
              <select id="sortProperties" value={query.sort} onChange={(e) => setQuery({ ...query, sort: e.target.value })}>
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="properties-grid" id="propertiesGrid">
            {items.map((p) => (
              <PropertyCard
                key={p._id}
                item={p}
                onOpen={openDetails}
                onToggleFav={toggleFav}
                isFav={fav.has(p._id)}
              />
            ))}
          </div>

          {!items.length && !loading && <div className="center muted" style={{ textAlign: "center", padding: 40, width: "100%" }}>No properties found.</div>}

          <div className="load-more-container">
            <button className="btn btn-outline" id="loadMoreBtn" onClick={() => loadProperties()}>Load More Properties</button>
          </div>
        </div>
      </section>

      {/* Maps Section */}
      <section className="maps-section" id="maps">
        <div className="container">
          <div className="section-header">
            <h2>Property <span className="highlight">Maps</span></h2>
            <p>Download detailed PDF maps of housing schemes and projects</p>
          </div>

          <div className="maps-grid" id="mapsGrid">
            {maps.length ? maps.map(m => (
              <div key={m._id} className="map-card">
                <div className="map-image-container">
                  {m.image ? <img src={getFileUrl(m.image)} className="map-image" alt={m.title} /> : <div className="placeholder">Map</div>}
                  <span className="map-badge">New</span>
                </div>
                <div className="map-info">
                  <h3 className="map-title">{m.title}</h3>
                  <p className="map-description">{m.description || "Housing scheme map with complete details."}</p>
                  <div className="map-details">
                    <span className="map-size"><i className="fas fa-file-pdf"></i> PDF File</span>
                    <div className="map-actions">
                      <button className="map-view-btn" onClick={() => { setActive(m); setOpen(true); }}>
                        <i className="fas fa-eye"></i> View
                      </button>
                      <a className="map-download-btn" href={getFileUrl(m.pdfUrl)} download={`${m.title.replace(/\s+/g, '_')}.pdf`} target="_blank" rel="noreferrer">
                        <i className="fas fa-download"></i> Download
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="empty-state">
                <i className="fas fa-map"></i>
                <h3>No Maps Available</h3>
                <p>Maps will be displayed here once added by admin</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Certificates Section */}
      <section className="certificates-section" id="certificates">
        <div className="container">
          <div className="section-header">
            <h2>Our <span className="highlight">Certificates</span></h2>
            <p>Official certifications and accreditations</p>
          </div>

          <div className="certificates-grid" id="certificatesGrid">
            {certs.length ? certs.map(c => (
              <div key={c._id} className="certificate-card">
                <img src={getFileUrl(c.imageUrl)} className="certificate-image" alt={c.title} />
                <div className="certificate-info">
                  <h3 className="certificate-title">{c.title}</h3>
                  <p className="certificate-description">{c.description || "Official certification."}</p>
                  <span className="certificate-status">Verified</span>
                </div>
              </div>
            )) : (
              <div className="empty-state">
                <i className="fas fa-award"></i>
                <h3>No Certificates Available</h3>
                <p>Certificates will be displayed here once added by admin</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section" id="services">
        <div className="container">
          <div className="section-header">
            <h2>Our <span className="highlight">Services</span></h2>
            <p>Complete real estate solutions for your needs</p>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-home"></i>
              </div>
              <h3>Property Buying</h3>
              <p>Find your dream home with our extensive collection of verified residential properties.</p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-key"></i>
              </div>
              <h3>Property Renting</h3>
              <p>Rental properties with complete documentation and legal verification.</p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <i class="fas fa-tasks"></i>
              </div>
              <h3>Property Management</h3>
              <p>Complete property management services including maintenance, tenant screening, and rent collection.</p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-building"></i>
              </div>
              <h3>Commercial Properties</h3>
              <p>Office spaces, shops, and commercial buildings for business expansion.</p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-file-contract"></i>
              </div>
              <h3>Legal Services</h3>
              <p>Complete legal documentation and property transfer assistance.</p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-search-dollar"></i>
              </div>
              <h3>Property Valuation</h3>
              <p>Accurate market valuation and investment consultancy.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="about">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>About <span className="highlight">RICHMOORESTATE</span></h2>
              <p>Established in 2008, RICHMOORESTATE & BUILDERS is a premier real estate agency in Pakistan with over 15 years of experience in property dealing. We specialize in residential and commercial properties across major cities.</p>

              <div className="about-features">
                <div className="feature">
                  <i className="fas fa-check-circle"></i>
                  <span>Verified Properties Only</span>
                </div>
                <div className="feature">
                  <i className="fas fa-check-circle"></i>
                  <span>Complete Legal Documentation</span>
                </div>
                <div className="feature">
                  <i className="fas fa-check-circle"></i>
                  <span>Market Competitive Prices</span>
                </div>
                <div className="feature">
                  <i className="fas fa-check-circle"></i>
                  <span>24/7 Customer Support</span>
                </div>
              </div>

              <div className="about-stats">
                <div className="stat">
                  <h3>15+</h3>
                  <p>Years Experience</p>
                </div>
                <div className="stat">
                  <h3>500+</h3>
                  <p>Properties Sold</p>
                </div>
                <div className="stat">
                  <h3>300+</h3>
                  <p>Happy Clients</p>
                </div>
                <div className="stat">
                  <h3>50+</h3>
                  <p>Prime Locations</p>
                </div>
              </div>
            </div>

            <div className="about-image">
              <img src="/logo.jpg" alt="Our Office" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section" id="contact">
        <div className="container">
          <div className="section-header">
            <h2>Contact <span className="highlight">Us</span></h2>
            <p>Get in touch with our expert property consultants</p>
          </div>

          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <h3>Office Address</h3>
                  <p>Office # 75 CCA, 1st Floor, Block DD<br />Phase 4, DHA Lahore, Pakistan</p>
                </div>
              </div>

              <div className="contact-item">
                <i className="fas fa-phone-alt"></i>
                <div>
                  <h3>Phone Numbers</h3>
                  <p>+92 301 4463416 (Primary)<br />+92 423 5694178 (Office)</p>
                </div>
              </div>

              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <div>
                  <h3>Email Address</h3>
                  <p>richmoorestatebuilders@gmail.com</p>
                </div>
              </div>

              <div className="contact-item">
                <i className="fas fa-clock"></i>
                <div>
                  <h3>Working Hours</h3>
                  <p>Monday - Saturday: 9:30 AM - 7:00 PM<br />Sunday: 10:00 AM - 5:00 PM</p>
                </div>
              </div>
            </div>

            <div className="contact-form">
              <h3>Send Inquiry</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Modals remain same logic-wise but maybe styled differently due to CSS updates. 
        I'll keep the Modal component structure but ensure it mounts correctly. 
    */}
      <Modal open={open} title={active?.title || "Property"} onClose={() => setOpen(false)} width={1000}>
        {active ? (
          <div className="property-popup-grid">
            <div className="popup-gallery">
              <div className="main-image-wrap">
                <img
                  src={active.images?.[activeImgIdx] ? getFileUrl(active.images[activeImgIdx]) : ""}
                  className="popup-main-image"
                  alt="Property"
                />
                {active.images?.length > 1 && (
                  <>
                    <button className="nav-arrow left" onClick={() => setActiveImgIdx((activeImgIdx - 1 + active.images.length) % active.images.length)}>
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    <button className="nav-arrow right" onClick={() => setActiveImgIdx((activeImgIdx + 1) % active.images.length)}>
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </>
                )}
              </div>
              <div className="thumbnails-row">
                {active.images?.map((img, i) => (
                  <img
                    key={i}
                    src={getFileUrl(img)}
                    className={`thumb-img ${i === activeImgIdx ? 'active' : ''}`}
                    alt="thumbnail"
                    onClick={() => setActiveImgIdx(i)}
                  />
                ))}
              </div>
            </div>

            <div className="popup-details">
              <h2 className="popup-title">{active.title}</h2>
              <div className="popup-price">Rs {formatPrice(active.price)}</div>
              <div className="popup-location">
                <i className="fas fa-map-marker-alt"></i> {active.location}
              </div>

              <h3>Description</h3>
              <p className="popup-desc">{active.description}</p>

              <div className="popup-features-grid">
                <div className="p-feature">
                  <i className="fas fa-home"></i>
                  <span>Type: {active.type}</span>
                </div>
                <div className="p-feature">
                  <i className="fas fa-tag"></i>
                  <span>Purpose: For {active.purpose}</span>
                </div>
                <div className="p-feature">
                  <i className="fas fa-bed"></i>
                  <span>Bedrooms: {active.bedrooms}</span>
                </div>
                <div className="p-feature">
                  <i className="fas fa-bath"></i>
                  <span>Bathrooms: {active.bathrooms}</span>
                </div>
                <div className="p-feature">
                  <i className="fas fa-ruler-combined"></i>
                  <span>Area: {active.area} {active.areaUnit}</span>
                </div>
                <div className="p-feature">
                  <i className="fas fa-calendar-alt"></i>
                  <span>Added: {new Date(active.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="popup-contact-card">
                <h3>Contact Agent</h3>
                <div className="agent-number">+92 301 4463416</div>
                <p className="muted">Call this number to inquire about this property.</p>
                <div className="popup-actions-row">
                  <a href={`tel:+923014463416`} className="btn-call-now">
                    <i className="fas fa-phone-alt"></i> CALL NOW
                  </a>
                  <a
                    href={`https://wa.me/923014463416?text=I am interested in ${active.title} (${active.location})`}
                    className="btn-whatsapp-agent"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fab fa-whatsapp"></i> CONTACT US
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>

      <InquiryModal
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        property={active}
        mode={inquiryMode}
      />
    </Layout>
  );
}

function ContactForm() {
  const [form, setForm] = React.useState({ name: "", phone: "", email: "", type: "", message: "", propertyReference: "" });
  const [loading, setLoading] = React.useState(false);
  const [msg, setMsg] = React.useState("");

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      await api.post("/inquiries", { ...form, source: "contact_page_new" });
      setMsg("Thank you! Your inquiry has been sent.");
      setForm({ name: "", phone: "", email: "", type: "", message: "", propertyReference: "" });
    } catch {
      setMsg("Error sending message. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form id="inquiryForm" onSubmit={submit}>
      <div className="form-group">
        <input type="text" placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
      </div>
      <div className="form-group">
        <input type="tel" placeholder="Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
      </div>
      <div className="form-group">
        <input type="email" placeholder="Email Address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      </div>
      <div className="form-group">
        <select required value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
          <option value="">Select Inquiry Type</option>
          <option value="property_viewing">Property Viewing</option>
          <option value="property_information">Property Information</option>
          <option value="price_negotiation">Price Negotiation</option>
          <option value="legal_assistance">Legal Assistance</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="form-group">
        <input type="text" placeholder="Property Reference (if any)" value={form.propertyReference} onChange={e => setForm({ ...form, propertyReference: e.target.value })} />
      </div>
      <div className="form-group">
        <textarea placeholder="Your Message" rows="4" required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}></textarea>
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        <i className="fas fa-paper-plane"></i> {loading ? "Sending..." : "Send Inquiry"}
      </button>
      {msg && <p style={{ color: 'green', marginTop: 10 }}>{msg}</p>}
    </form>
  )
}

function InquiryModal({ open, onClose, property, mode }) {
  // Reusing the modal logic but ensuring styles match
  // For simplicity, we can keep the previous InquiryModal implementation but it needs to be compatible with new CSS classes like .modal-content
  // The Modal component handles the outer shell.

  const [form, setForm] = React.useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = React.useState(false);
  const [msg, setMsg] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setForm({
        name: "", email: "", phone: "",
        message: mode === "schedule_viewing" ? "I want to schedule a viewing." : "I am interested in this property."
      });
      setMsg("");
    }
  }, [open, mode]);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/inquiries", { ...form, propertyId: property?._id, source: mode });
      setMsg("Sent successfully.");
      setTimeout(onClose, 2000);
    } catch {
      setMsg("Error sending.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} title={mode === "schedule_viewing" ? "Schedule Viewing" : "Quick Inquiry"} onClose={onClose}>
      <form onSubmit={submit} className="contact-form" style={{ padding: 0, boxShadow: 'none' }}>
        <div className="form-group">
          <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="form-group">
          <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
        </div>
        <div className="form-group">
          <textarea placeholder="Message" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
        </div>
        <button className="btn btn-primary" disabled={loading}>{loading ? "Sending..." : "Submit"}</button>
        {msg && <p>{msg}</p>}
      </form>
    </Modal>
  )
}
