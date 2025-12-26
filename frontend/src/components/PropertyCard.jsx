import React from "react";
import { getFileUrl } from "../lib/api";

export default function PropertyCard({ item, onOpen, onToggleFav, isFav, onToggleCompare, isCompared }) {
  const cover = item.images?.[0] ? getFileUrl(item.images[0]) : "";
  return (
    <div className="card property-card">
      <div className="property-cover" onClick={() => onOpen(item)}>
        {cover ? <img src={cover} alt={item.title} /> : <div className="placeholder">No Image</div>}
        <div className="pill-row">
          <span className={`pill ${item.purpose}`}>{item.purpose.toUpperCase()}</span>
          <span className={`pill status-${item.status}`}>{item.status}</span>
        </div>
      </div>

      <div className="property-body">
        <h4 onClick={() => onOpen(item)} className="clickable">{item.title}</h4>
        <div className="muted"><i className="fas fa-location-dot" /> {item.location}</div>

        <div className="meta">
          <span><i className="fas fa-bed" /> {item.bedrooms || 0}</span>
          <span><i className="fas fa-bath" /> {item.bathrooms || 0}</span>
          <span><i className="fas fa-ruler-combined" /> {item.area || 0} {item.areaUnit || "sq.ft"}</span>
        </div>

        <div className="property-footer">
          <div className="price">PKR {formatPrice(item.price)}</div>
          <div className="actions">
            <button className={`icon-btn ${isFav ? "active" : ""}`} onClick={() => onToggleFav(item)}>
              <i className="fas fa-heart" />
            </button>
            <button className={`icon-btn ${isCompared ? "active" : ""}`} onClick={() => onToggleCompare(item)}>
              <i className="fas fa-code-compare" />
            </button>
            <button className="btn btn-primary" onClick={() => onOpen(item)}>View</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatPrice(n) {
  const num = Number(n || 0);
  return num.toLocaleString("en-PK");
}
