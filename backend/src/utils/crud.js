export function parseListQuery(req) {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(100, Math.max(1, Number(req.query.limit || 12)));
  const q = (req.query.q || "").toString().trim();
  const sort = (req.query.sort || "newest").toString();
  const city = (req.query.city || "").toString().trim().toLowerCase();
  const type = (req.query.type || "").toString().trim().toLowerCase();
  const purpose = (req.query.purpose || "").toString().trim().toLowerCase();
  const status = (req.query.status || "").toString().trim().toLowerCase();
  return { page, limit, q, sort, city, type, purpose, status };
}

export function buildSort(sortKey) {
  switch (sortKey) {
    case "price_asc": return { price: 1 };
    case "price_desc": return { price: -1 };
    case "oldest": return { createdAt: 1 };
    case "newest":
    default: return { createdAt: -1 };
  }
}
