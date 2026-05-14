const API_BASE = "http://localhost:8080";

// Entity-specific base URLs
const APARTMENT_BASE = `${API_BASE}/api/apartment`;
const SCHOOL_BASE = `${API_BASE}/api/escola`;

const REVIEWER_BASE = `${API_BASE}/api/reviewer`;
const OWNER_BASE = `${API_BASE}/api/owner`;

export const ENDPOINTS = {
  apartment: {
    base: APARTMENT_BASE,
    getAll: `${APARTMENT_BASE}/list`,
    getById: (id) => `${APARTMENT_BASE}/${id}`,
    create: `${APARTMENT_BASE}/nou`,
    update: (id) => `${APARTMENT_BASE}/actualitzar/${id}`,
    deleteById: (id) => `${APARTMENT_BASE}/esborrar/${id}`,
    addRenovation: (id) => `${APARTMENT_BASE}/${id}/renovations`,
  },
  school: {
    base: SCHOOL_BASE,
    getAll: `${SCHOOL_BASE}/llistar`,
    getById: (id) => `${SCHOOL_BASE}/${id}`,
    create: `${SCHOOL_BASE}/afegir`,
    update: (id) => `${SCHOOL_BASE}/modificar/${id}`,
    deleteById: (id) => `${SCHOOL_BASE}/esborrar/${id}`,
  },
  reviewer: {
    base: REVIEWER_BASE,
    getAll: `${REVIEWER_BASE}/getAll`,
    getById: (id) => `${REVIEWER_BASE}/${id}`,
    create: `${REVIEWER_BASE}/create`,
    update: `${REVIEWER_BASE}/update`,
    deleteById: (id) => `${REVIEWER_BASE}/deleteById?id=${id}`,
  },
  owner: {
    base: OWNER_BASE,
    getAll: `${OWNER_BASE}/getAll`,
    getById: (id) => `${OWNER_BASE}/${id}`,
    create: `${OWNER_BASE}/create`,
    update: `${OWNER_BASE}/update`,
    deleteById: (id) => `${OWNER_BASE}/deleteById?id=${id}`,
  },
};

export default ENDPOINTS;

