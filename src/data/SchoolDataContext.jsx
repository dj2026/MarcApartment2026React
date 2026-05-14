import { createContext, useContext, useState, useEffect } from 'react';
import { useSchoolService } from '../middleware/school/schoolServiceHooks';

const SchoolDataContext = createContext();

export const SchoolDataProvider = ({ children }) => {
  const [schools, setSchools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAxiosError, setIsAxiosError] = useState(false);
  
  const schoolService = useSchoolService();

  const fetchSchools = async () => {
    setIsLoading(true);
    setIsAxiosError(false);
    try {
      const schoolsData = await schoolService.getAllSchools();
      setSchools(schoolsData);
    } catch (error) {
      console.error("Error fetching schools:", error);
      setIsAxiosError(error.isAxiosError || !!error.response || error.message.includes('axios'));
      setSchools([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    schools,
    isLoading,
    isAxiosError,
    refetch: fetchSchools
  };

  return (
    <SchoolDataContext.Provider value={value}>
      {children}
    </SchoolDataContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSchoolData = () => {
  const context = useContext(SchoolDataContext);
  if (!context) {
    throw new Error('useSchoolData must be used within SchoolDataProvider');
  }
  return context;
};

