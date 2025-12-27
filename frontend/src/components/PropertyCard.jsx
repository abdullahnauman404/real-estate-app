import React from "react";
import { getFileUrl } from "../lib/api";

export default function PropertyCard({ item, onOpen, onToggleFav, isFav }) {
  const cover = item.images?.[0] ? getFileUrl(item.images[0]) : "https://via.placeholder.com/400x300?text=No+Image";

  // Badge logic
  let badgeClass = "badge-sale";
  let badgeText = "For Sale";
  if (item.purpose === "rent") {
    badgeClass = "badge-rent";
    badgeText = "For Rent";
  } else if (item.type === "plot") {
    badgeClass = "badge-plot";
    badgeText = "Plot";
  }

  return (
    <div className="property-card">
      <div className="property-image">
        <img src={cover} alt={item.title} />
        <span className={`property-badge ${badgeClass}`}>{badgeText}</span>
      </div>
      <div className="property-info">
        <div className="property-price">
          PKR {formatPrice(item.price)}
          <span style={{ textTransform: 'capitalize' }}>{item.type}</span>
        </div>
        <h3 className="property-title">{item.title}</h3>
        <div className="property-location">
          <i className="fas fa-map-marker-alt"></i> {item.location}
        </div>
        <div className="property-features">
          <div className="feature">
            <i className="fas fa-bed"></i>
            <span>{item.bedrooms || 0} Beds</span>
          </div>
          <div className="feature">
            <i className="fas fa-bath"></i>
            <span>{item.bathrooms || 0} Baths</span>
          </div>
          <div className="feature">
            <i className="fas fa-ruler-combined"></i>
            <span>{item.area || 0} {item.areaUnit || "sq.ft"}</span>
          </div>
        </div>
        <div className="property-actions">
          <button className="btn btn-outline" onClick={() => onOpen(item)}>View Details</button>
          {/* Contact button can open inquiry directly, or just view details first. 
                   Design shows Contact. For now, let's make it open details or inquiry.
                   I'll make it open details for consistency with previous logic, 
                   or I could pass a specific 'contact' handler. 
                   Let's stick to onOpen for both or add a semantic difference if needed. 
                   I'll use onOpen for now as Details modal has actions. */}
          <button className="btn btn-primary" onClick={() => onOpen(item)}>Contact</button>
        </div>
      </div>
    </div>
  );
}

function formatPrice(n) {
  const num = Number(n || 0);
  if (num >= 10000000) return (num / 10000000).toFixed(2) + " Crore";
  if (num >= 100000) return (num / 100000).toFixed(2) + " Lakh";
  return num.toLocaleString("en-PK");
}
