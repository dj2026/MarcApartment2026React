import React, { createContext, useContext, useReducer, useMemo } from 'react';
import { useApartments } from '../middleware/apartment/apartmentServiceHooks';

const ApartmentContext = createContext();

const ESTAT_INICIAL_FORM = {
  propertyType: "APARTMENT", 
  price: 0, 
  area: 75, 
  bedrooms: 1, 
  bathrooms: 1, 
  stories: 1, 
  parking: 0, 
  mainroad: "no", 
  guestroom: "no", 
  basement: "no", 
  hotwaterheating: "no", 
  airconditioning: "no", 
  terrace: "no",
  prefarea: "no", 
  furnishingstatus: "unfurnished", 
  description: "Nova propietat",
  ownerName: "",
  renovations: []
};

function apartmentReducer(state, action) {
  switch (action.type) {
    case "SET_FIELD": 
      return {
        ...state, 
        dadesForm: { ...state.dadesForm, [action.field]: action.value }
      };

    case "ADD_RENOVATION":
      return {
        ...state,
        dadesForm: {
          ...state.dadesForm,
          renovations: [action.payload, ...(state.dadesForm.renovations || [])]
        }
      };

    case "SELECT": 
      { 
        const pis = action.payload;
        return {
          ...state, 
          dadesForm: { 
            ...ESTAT_INICIAL_FORM, 
            ...pis,
            renovations: pis?.renovations || [], 
            ownerName: pis?.owner?.name || pis?.ownerName || "" 
          }, 
          idEdicio: pis?.id || null
        }; 
      }

    case "RESET": 
      return { dadesForm: ESTAT_INICIAL_FORM, idEdicio: null };

    default: 
      return state;
  }
}

export const ApartmentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(apartmentReducer, { 
    dadesForm: ESTAT_INICIAL_FORM, 
    idEdicio: null 
  });

  const { data, isLoading, refetch, isFetching, isError } = useApartments();

  // Funció per guardar a Java / H2
  const addRenovationToCurrent = async (renovation) => {
    if (!state.idEdicio) {
      alert("Siusplau, selecciona primer una propietat de la llista.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/apartments/${state.idEdicio}/renovations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(renovation)
      });

      if (response.ok) {
        dispatch({ type: "ADD_RENOVATION", payload: renovation });
        refetch(); // Sincronitza amb el backend
      } else {
        throw new Error("Error al servidor Java");
      }
    } catch (err) {
      console.error("Error persistent la reforma:", err);
    }
  };

  const value = useMemo(() => ({ 
    state, 
    dispatch, 
    apartments: data || [], 
    isLoading, 
    refetch, 
    isFetching,
    isError,
    addRenovationToCurrent 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [state, data, isLoading, isFetching, refetch, isError]);

  return (
    <ApartmentContext.Provider value={value}>
      {children}
    </ApartmentContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApartmentData = () => {
  const context = useContext(ApartmentContext);
  if (!context) throw new Error("useApartmentData ha de fer-se servir dins d'ApartmentProvider");
  return context;
};