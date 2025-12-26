import Property from "../models/Property.js";
import PdfMap from "../models/PdfMap.js";

const defaultProperties = [];

const defaultMaps = [
  {
    "id": 1,
    "title": "Amendment Master Plan of Lahore Division",
    "description": "Complete master plan of Lahore Division with all sectors and developments",
    "image": "https://images.unsplash.com/photo-1564501049418-3c27787d01e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "pdfUrl": "https://lahorerealestate.com/wp-content/uploads/2021/03/Amendment_Master_Plan_of_Lahore_Division.pdf",
    "size": "15.2 MB",
    "category": "master-plan",
    "tags": [
      "lahore",
      "master-plan",
      "division"
    ]
  },
  {
    "id": 2,
    "title": "Al Kabir Town Phase 2 Map",
    "description": "Detailed map of Al Kabir Town Phase 2 showing plots and sectors",
    "image": "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "pdfUrl": "https://lahorerealestate.com/pdf/download/Al-Kabir-Town-Phase-II-Map-LRE.pdf",
    "size": "8.5 MB",
    "category": "lahore",
    "tags": [
      "lahore",
      "al-kabir"
    ]
  },
  {
    "id": 3,
    "title": "Bahria Al Rehmat Map",
    "description": "Complete layout of Bahria Al Rehmat housing scheme",
    "image": "https://images.unsplash.com/photo-1564501049418-3c27787d01e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "pdfUrl": "https://lahorerealestate.com/wp-content/uploads/2022/02/LRE-Bahria-Al-Rehmat-Map.pdf",
    "size": "12.3 MB",
    "category": "lahore",
    "tags": [
      "lahore",
      "bahria",
      "al-rehmat"
    ]
  }
];

export async function seedIfEmpty() {
  const propCount = await Property.countDocuments();
  if (propCount === 0 && defaultProperties.length) {
    await Property.insertMany(defaultProperties.map((p) => {
      // Convert legacy numeric ids to Mongo-generated ids
      return {
        title: p.title,
        location: p.location,
        city: (p.city || "lahore").toLowerCase(),
        type: (p.type || "house").toLowerCase(),
        purpose: (p.purpose || "sale") === "rent" ? "rent" : "sale",
        price: Number(p.price || 0),
        area: Number(p.area || 0),
        areaUnit: p.areaUnit || "sq.ft",
        bedrooms: Number(p.bedrooms || 0),
        bathrooms: Number(p.bathrooms || 0),
        description: p.description || "",
        contactPhone: p.contactPhone || "",
        status: p.status || "active",
        images: Array.isArray(p.images) ? p.images : [],
      };
    }));
    console.log(`Seeded ${defaultProperties.length} properties`);
  }

  const mapCount = await PdfMap.countDocuments();
  if (mapCount === 0 && defaultMaps.length) {
    await PdfMap.insertMany(defaultMaps.map((m) => ({
      title: m.title,
      description: m.description || "",
      image: m.image || "",
      pdfUrl: m.pdfUrl,
      size: m.size || "",
      category: (m.category || "general").toLowerCase(),
      tags: Array.isArray(m.tags) ? m.tags.map((t)=>String(t).toLowerCase()) : [],
      status: "active",
    })));
    console.log(`Seeded ${defaultMaps.length} maps`);
  }
}
