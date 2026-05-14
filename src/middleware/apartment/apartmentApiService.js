import axios from "axios";
import ENDPOINTS from "../config/endpoints.js";

// eslint-disable-next-line no-undef
const MySwal = (typeof Swal !== 'undefined' ? Swal.mixin({
  customClass: { 
    popup: "my-swal-popup", 
    confirmButton: "my-swal-confirm", 
    cancelButton: "my-swal-cancel" 
  },
  buttonsStyling: false
}) : null);

const prepararPerEnviar = (dades) => {
  if (!dades) return {};
  const json = JSON.parse(JSON.stringify(dades));
  
  if (!json.id || json.id === "" || json.id === "AUTO") delete json.id;

  const defaults = {
    propertyType: json.propertyType || "APARTMENT",
    price: (Number(json.price) > 0) ? Number(json.price) : 0,
    area: (Number(json.area) > 0) ? Number(json.area) : 80,
    bedrooms: (Number(json.bedrooms) > 0) ? Number(json.bedrooms) : 2,
    bathrooms: (Number(json.bathrooms) > 0) ? Number(json.bathrooms) : 1,
    stories: (Number(json.stories) > 0) ? Number(json.stories) : 1,
    parking: Number(json.parking) || 0,
    mainroad: json.mainroad || "no",
    guestroom: json.guestroom || "no",
    basement: json.basement || "no",
    hotwaterheating: json.hotwaterheating || "no",
    airconditioning: json.airconditioning || "no",
    terrace: json.terrace || "no",
    prefarea: json.prefarea || "no",
    furnishingstatus: json.furnishingstatus || "unfurnished",
    description: json.description || "Sense descripció",
    owner: json.owner || (json.ownerName ? { name: json.ownerName } : null)
  };

  const final = { ...json, ...defaults };
  
  // Camps que el backend NO accepta per a l'entitat Apartment
  const borrar = ["reviews", "propertyContracts", "schools", "averageRating", "reviewCount", "ressenya", "selectedSchoolId", "ownerName"];
  borrar.forEach(key => delete final[key]);
  
  return final;
};

const ApartmentApiService = {
  getAllApartments: async () => {
    try {
      const response = await axios.get(ENDPOINTS.apartment.getAll);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching apartments:", error);
      return [];
    }
  },

  createApartment: async (apartment) => {
    const response = await axios.post(ENDPOINTS.apartment.create, prepararPerEnviar(apartment));
    return response.data;
  },

  updateApartment: async (apartment) => {
    const response = await axios.put(ENDPOINTS.apartment.update(apartment.id), prepararPerEnviar(apartment));
    return response.data;
  },

  deleteApartment: async (apartmentId) => {
    const response = await axios.delete(ENDPOINTS.apartment.deleteById(apartmentId));
    return response.data;
  },

  // ✅ NOU MÈTODE PER A REFORMES (Connexió amb H2)
  addRenovation: async (apartmentId, renovation) => {
    // Aquí no fem servir 'prepararPerEnviar' perquè la reforma té camps diferents
    const response = await axios.post(ENDPOINTS.apartment.addRenovation(apartmentId), renovation);
    return response.data;
  },

  // Mètodes de compatibilitat (Legacy)
  llistar: () => ApartmentApiService.getAllApartments(),
  crear: (dades) => ApartmentApiService.createApartment(dades),
  actualitzar: (dades) => ApartmentApiService.updateApartment(dades),
  esborrar: (id) => ApartmentApiService.deleteApartment(id),
  afegirReforma: (id, data) => ApartmentApiService.addRenovation(id, data), // Alias legacy
  alert: MySwal
};

export default ApartmentApiService;