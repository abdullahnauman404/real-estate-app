import React from "react";
import Layout from "../components/Layout";
import PropertyCard from "../components/PropertyCard";
import Modal from "../components/Modal";
import { api, getFileUrl } from "../lib/api";

const FAV_KEY = "richmoore_favorites";
const COMP_KEY = "richmoore_compare";

export default function Home() {
  const [items, setItems] = React.useState([]);
  const [query, setQuery] = React.useState({ q: "", city: "", type: "", purpose: "", sort: "newest" });
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(null);

  const [fav, setFav] = React.useState(() => new Set(JSON.parse(localStorage.getItem(FAV_KEY) || "[]")));
  const [compare, setCompare] = React.useState(() => new Set(JSON.parse(localStorage.getItem(COMP_KEY) || "[]")));

  const [inquiryOpen, setInquiryOpen] = React.useState(false);
  const [inquiryMode, setInquiryMode] = React.useState("inquiry");

  React.useEffect(() => {
    load(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.city, query.type, query.purpose, query.sort]);

  async function load(nextPage, replace = false) {
    setLoading(true);
    try {
      const res = await api.get("/properties", { params: { ...query, page: nextPage, limit: 9, status: "active" } });
      setHasMore(Boolean(res.data.hasMore));
      setPage(res.data.page);
      setItems(replace ? res.data.items : [...items, ...res.data.items]);
    } finally {
      setLoading(false);
    }
  }

  function onSearch(e) {
    e.preventDefault();
    load(1, true);
  }

  function toggleFav(item) {
    const next = new Set(fav);
    const id = item._id;
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setFav(next);
    localStorage.setItem(FAV_KEY, JSON.stringify(Array.from(next)));
  }

  function toggleCompare(item) {
    const next = new Set(compare);
    const id = item._id;
    if (next.has(id)) next.delete(id);
    else {
      if (next.size >= 3) return alert("You can compare max 3 properties.");
      next.add(id);
    }
    setCompare(next);
    localStorage.setItem(COMP_KEY, JSON.stringify(Array.from(next)));
  }

  function openDetails(item) {
    setActive(item);
    setOpen(true);
  }

  function openInquiry(mode) {
    setInquiryMode(mode);
    setInquiryOpen(true);
  }

  return (
    <Layout>
      <section className="hero">
        <div className="hero-inner">
          <h1>Find your next property in Pakistan</h1>
          <p>Search verified listings, view details, and send inquiry in minutes.</p>

          <form className="searchbar" onSubmit={onSearch}>
            <input
              placeholder="Search by title, location, keywords..."
              value={query.q}
              onChange={(e) => setQuery({ ...query, q: e.target.value })}
            />
            <select value={query.city} onChange={(e) => setQuery({ ...query, city: e.target.value })}>
              <option value="">All Cities</option>
              <option value="lahore">Lahore</option>
              <option value="karachi">Karachi</option>
              <option value="islamabad">Islamabad</option>
              <option value="rawalpindi">Rawalpindi</option>
            </select>
            <select value={query.type} onChange={(e) => setQuery({ ...query, type: e.target.value })}>
              <option value="">All Types</option>
              <option value="villa">Villa</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="plot">Plot</option>
              <option value="commercial">Commercial</option>
            </select>
            <select value={query.purpose} onChange={(e) => setQuery({ ...query, purpose: e.target.value })}>
              <option value="">Sale + Rent</option>
              <option value="sale">Sale</option>
              <option value="rent">Rent</option>
            </select>
            <select value={query.sort} onChange={(e) => setQuery({ ...query, sort: e.target.value })}>
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
            <button className="btn btn-primary" type="submit">
              <i className="fas fa-magnifying-glass" /> Search
            </button>
          </form>

          {compare.size ? <CompareBar count={compare.size} onClear={() => { setCompare(new Set()); localStorage.removeItem(COMP_KEY); }} /> : null}
        </div>
      </section>

      <section className="grid">
        {items.map((p) => (
          <PropertyCard
            key={p._id}
            item={p}
            onOpen={openDetails}
            onToggleFav={toggleFav}
            isFav={fav.has(p._id)}
            onToggleCompare={toggleCompare}
            isCompared={compare.has(p._id)}
          />
        ))}
      </section>

      <div className="center mt-24">
        {hasMore ? (
          <button className="btn btn-ghost" disabled={loading} onClick={() => load(page + 1, false)}>
            {loading ? "Loading..." : "Load more"}
          </button>
        ) : (
          <div className="muted">{loading ? "Loading..." : "No more properties."}</div>
        )}
      </div>

      <Modal open={open} title={active?.title || "Property"} onClose={() => setOpen(false)} width={980}>
        {active ? (
          <div className="details">
            <Gallery images={active.images || []} />
            <div className="details-right">
              <div className="details-price">PKR {Number(active.price || 0).toLocaleString("en-PK")}</div>
              <div className="muted"><i className="fas fa-location-dot" /> {active.location}</div>

              <div className="details-meta">
                <span><i className="fas fa-bed" /> {active.bedrooms || 0} Beds</span>
                <span><i className="fas fa-bath" /> {active.bathrooms || 0} Baths</span>
                <span><i className="fas fa-ruler-combined" /> {active.area || 0} {active.areaUnit || "sq.ft"}</span>
              </div>

              <p className="details-desc">{active.description}</p>

              <div className="details-actions">
                <button className="btn btn-primary" onClick={() => openInquiry("inquiry")}>
                  Send Inquiry
                </button>
                <button className="btn btn-ghost" onClick={() => openInquiry("schedule_viewing")}>
                  Schedule Viewing
                </button>
                {active.contactPhone ? (
                  <a className="btn btn-ghost" href={`tel:${active.contactPhone}`}>
                    Call Now
                  </a>
                ) : null}
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

function Gallery({ images }) {
  const [i, setI] = React.useState(0);
  const safe = (images || []).filter(Boolean);
  if (!safe.length) return <div className="gallery empty">No images</div>;
  const url = getFileUrl(safe[i]);

  return (
    <div className="gallery">
      <img src={url} alt="Property" />
      <div className="thumbs">
        {safe.map((src, idx) => (
          <button
            key={src + idx}
            className={`thumb ${idx === i ? "active" : ""}`}
            onClick={() => setI(idx)}
            type="button"
          >
            <img src={getFileUrl(src)} alt="thumb" />
          </button>
        ))}
      </div>
    </div>
  );
}

function CompareBar({ count, onClear }) {
  return (
    <div className="comparebar">
      <div><i className="fas fa-code-compare" /> Compared: {count} (max 3)</div>
      <button className="btn btn-ghost" onClick={onClear}>Clear</button>
    </div>
  );
}

function InquiryModal({ open, onClose, property, mode }) {
  const [form, setForm] = React.useState({ name: "", email: "", phone: "", message: "" });
  const [state, setState] = React.useState({ loading: false, msg: "" });

  React.useEffect(() => {
    if (open) {
      setForm((f) => ({
        ...f,
        message: mode === "schedule_viewing"
          ? "I want to schedule a viewing. Please share available slots."
          : "I am interested in this property. Please contact me.",
      }));
      setState({ loading: false, msg: "" });
    }
  }, [open, mode]);

  async function submit(e) {
    e.preventDefault();
    setState({ loading: true, msg: "" });
    try {
      await api.post("/inquiries", {
        ...form,
        propertyId: property?._id,
        propertyTitle: property?.title,
        source: mode === "schedule_viewing" ? "schedule_viewing" : "inquiry",
      });
      setState({ loading: false, msg: "Submitted. Our team will contact you soon." });
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setState({ loading: false, msg: err?.response?.data?.message || "Could not submit." });
    }
  }

  return (
    <Modal open={open} title={mode === "schedule_viewing" ? "Schedule Viewing" : "Send Inquiry"} onClose={onClose} width={680}>
      <form className="form" onSubmit={submit}>
        <div className="row">
          <label>Name</label>
          <input value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} required />
        </div>
        <div className="row">
          <label>Email</label>
          <input type="email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} />
        </div>
        <div className="row">
          <label>Phone</label>
          <input value={form.phone} onChange={(e)=>setForm({...form, phone:e.target.value})} required />
        </div>
        <div className="row">
          <label>Message</label>
          <textarea rows="4" value={form.message} onChange={(e)=>setForm({...form, message:e.target.value})} required />
        </div>
        <div className="actions">
          <button className="btn btn-primary" disabled={state.loading}>
            {state.loading ? "Submitting..." : "Submit"}
          </button>
          <button className="btn btn-ghost" type="button" onClick={onClose}>Close</button>
        </div>
        {state.msg ? <div className="hint">{state.msg}</div> : null}
      </form>
    </Modal>
  );
}
