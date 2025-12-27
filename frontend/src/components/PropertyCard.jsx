import React from "react";
import { getFileUrl } from "../lib/api";
import { formatPrice } from "../lib/utils";

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
        <div className="property-price-row">
          <span className="price-tag">Rs {formatPrice(item.price)}</span>
        </div>
        <h3 className="property-title">{item.title}</h3>
        <div className="property-location">
          <i className="fas fa-map-marker-alt"></i> {item.location}
        </div>

        <div className="property-features-modern">
          <div className="feature-modern">
            <i className="fas fa-bed"></i>
            <span>{item.bedrooms || 0} Beds</span>
          </div>
          <div className="feature-modern">
            <i className="fas fa-bath"></i>
            <span>{item.bathrooms || 0} Baths</span>
          </div>
          <div className="feature-modern">
            <i className="fas fa-ruler-combined"></i>
            <span>{item.area || 0} {item.areaUnit || "sq.ft"}</span>
          </div>
        </div>

        <div className="property-actions-modern">
          <button className="btn-view-details" onClick={() => onOpen(item)}>
            VIEW DETAILS
          </button>
          <a
            href={`https://wa.me/923014463416?text=I am interested in ${item.title} (${item.location})`}
            className="btn-schedule-viewing"
            target="_blank"
            rel="noreferrer"
          >
            CONTACT
          </a>
        </div>
      </div>
    </div>
  );
}
