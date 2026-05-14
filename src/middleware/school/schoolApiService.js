import axios from "axios";
import ENDPOINTS from "../config/endpoints.js";
import { Apartments } from "../../data/data";

// eslint-disable-next-line no-undef
const MySwal = (typeof Swal !== 'undefined' ? Swal.mixin({
  customClass: { 
    popup: "my-swal-popup", 
    confirmButton: "my-swal-confirm", 
    cancelButton: "my-swal-cancel" 
  },
  buttonsStyling: false
}) : null);

const prepararEscola = (dades) => {
  const copiaDades = { ...dades }; 
  
  if (!copiaDades.id || copiaDades.id === "AUTO") delete copiaDades.id;

  const selectedApt = Apartments.find(a => String(a.id) === String(copiaDades.apartmentId));
  const {...restOfData } = copiaDades;

  return {
    ...restOfData, 
    lat: parseFloat(restOfData.lat) || 0,
    lng: parseFloat(restOfData.lng) || 0,
    apartments: selectedApt ? [{ 
      id: Number(selectedApt.id),
      propertyType: (selectedApt.propertyType || "APARTMENT").toUpperCase() 
    }] : [],
    isPublic: restOfData.schoolType?.toUpperCase() === "PUBLICA"
  };
};

const SchoolApiService = {
  getAllSchools: async () => {
    try {
      const response = await axios.get(ENDPOINTS.school.getAll);
      return response.data;
    } catch (error) {
      console.error("Error fetching schools:", error);
      throw error;
    }
  },

  getSchoolById: async (schoolId) => {
    try {
      const response = await axios.get(ENDPOINTS.school.getById(schoolId));
      return response.data;
    } catch (error) {
      console.error(`Error fetching school ${schoolId}:`, error);
      throw error;
    }
  },

  createSchool: async (school) => {
    try {
      const neta = prepararEscola(school);
      console.log("🚀 Payload Final (Majúscules):", neta); 
      const response = await axios.post(ENDPOINTS.school.create, neta);
      return response.data;
    } catch (error) {
      console.error("Error creating school:", error);
      throw error;
    }
  },

  updateSchool: async (school) => {
    try {
      const neta = prepararEscola(school);
      const response = await axios.put(ENDPOINTS.school.update(school.id), neta);
      return response.data;
    } catch (error) {
      console.error(`Error updating school ${school.id}:`, error);
      throw error;
    }
  },

  deleteSchool: async (schoolId) => {
    try {
      const response = await axios.delete(ENDPOINTS.school.deleteById(schoolId));
      return response.data;
    } catch (error) {
      console.error(`Error deleting school ${schoolId}:`, error);
      throw error;
    }
  },

  // Legacy methods for compatibility
  llistarEscoles: () => SchoolApiService.getAllSchools(),
  crearEscola: (dades) => SchoolApiService.createSchool(dades),
  actualitzarEscola: (id, dades) => SchoolApiService.updateSchool({...dades, id }),
  esborrarEscola: (id) => SchoolApiService.deleteSchool(id),
  alert: MySwal
};

export default SchoolApiService;

