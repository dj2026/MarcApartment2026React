import { createContext, useContext, useState, useEffect, useReducer } from 'react';
import { useApartmentService } from '../middleware/apartment/apartmentServiceHooks';

const ApartmentDataContext = createContext();

// 1. Definim l'estat inicial que el formulari espera
const ESTAT_INICIAL_FORM = {
    propertyType: "APARTMENT", price: 0, area: 75, bedrooms: 1, bathrooms: 1,
    stories: 1, parking: 0, mainroad: "no", guestroom: "no", basement: "no",
    hotwaterheating: "no", airconditioning: "no", prefarea: "no",
    furnishingstatus: "unfurnished", description: ""
};

// 2. El Reducer que gestiona els canvis al formulari
function apartmentReducer(state, action) {
    switch (action.type) {
        case "SET_FIELD":
            return { ...state, dadesForm: { ...state.dadesForm, [action.field]: action.value } };
        case "SELECT":
            return { dadesForm: { ...ESTAT_INICIAL_FORM, ...action.payload }, idEdicio: action.payload.id };
        case "RESET":
            return { dadesForm: ESTAT_INICIAL_FORM, idEdicio: null };
        default:
            return state;
    }
}

export const ApartmentDataProvider = ({ children }) => {
    // 3. Afegim el useReducer aquí dins
    const [state, dispatch] = useReducer(apartmentReducer, { dadesForm: ESTAT_INICIAL_FORM, idEdicio: null });
    
    const [apartments, setApartments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAxiosError, setIsAxiosError] = useState(false);
    const apartmentService = useApartmentService();

    const fetchApartments = async () => {
        setIsLoading(true);
        setIsAxiosError(false);
        try {
            const apartmentsData = await apartmentService.getAllApartments();
            setApartments(Array.isArray(apartmentsData) ? apartmentsData : []);
        } catch (error) {
            console.error("Error fetching apartments:", error);
            setIsAxiosError(true);
            setApartments([]);
        } finally {
            setIsLoading(false);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { fetchApartments(); }, []);

    const value = {
        state,      
        dispatch,   
        apartments,
        isLoading,
        isAxiosError,
        refetch: fetchApartments
    };

    return (
        <ApartmentDataContext.Provider value={value}>
            {children}
        </ApartmentDataContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApartmentData = () => {
    const context = useContext(ApartmentDataContext);
    if (!context) throw new Error('useApartmentData must be used within ApartmentDataProvider');
    return context;
};