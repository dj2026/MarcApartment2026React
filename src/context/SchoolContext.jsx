import React, { createContext, useContext, useReducer, useMemo } from 'react';

const SchoolContext = createContext(null);

// 1. AFEGIM logoUrl A L'ESTAT INICIAL
const ESTAT_INICIAL = {
  name: "", 
  address: "", 
  schoolType: "PUBLICA", 
  educationLevel: "",
  isPublic: true, 
  lat: 41.3851, 
  lng: 2.1734, 
  apartmentId: 1,
  logoUrl: "" 
};

function schoolReducer(state, action) {
  switch (action.type) {
    case "SET_FIELD": {
      const { field, value } = action;
      
      let updatedFields = { ...state.dadesForm, [field]: value };
      
      if (field === "schoolType") {
        updatedFields.isPublic = (value === "PUBLICA");
      }

      return { 
        ...state, 
        dadesForm: updatedFields 
      };
    }

    case "SELECT": 

      return { 
        ...state, 
        dadesForm: { 
          ...ESTAT_INICIAL, 
          ...action.payload 
        }, 
        idEdicio: action.payload.id 
      };

    case "RESET": 
      // Torna tot a buit (inclòs el logo)
      return { 
        dadesForm: ESTAT_INICIAL, 
        idEdicio: null 
      };

    case "SET_ID_EDICIO":
      return { ...state, idEdicio: action.payload };

    default: 
      return state;
  }
}

export const SchoolProvider = ({ children }) => {
  const [state, dispatch] = useReducer(schoolReducer, { 
    dadesForm: ESTAT_INICIAL, 
    idEdicio: null 
  });

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <SchoolContext.Provider value={value}>{children}</SchoolContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSchoolContext = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    console.error("useSchoolContext ha de ser utilitzat dins d'un SchoolProvider");
  }
  return context;
};