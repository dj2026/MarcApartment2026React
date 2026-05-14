import { createContext, useContext, useState, useEffect } from 'react';
import { useOwnerService } from '../middleware/owner/ownerServiceHooks';

const OwnerDataContext = createContext();

export const OwnerDataProvider = ({ children }) => {
  const [owners, setOwners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAxiosError, setIsAxiosError] = useState(false);
  
  const ownerService = useOwnerService();

  const fetchOwners = async () => {
    setIsLoading(true);
    setIsAxiosError(false);
    try {
      const ownersData = await ownerService.getAllOwners();
      setOwners(ownersData);
    } catch (error) {
      console.error("Error fetching owners:", error);
      setIsAxiosError(error.isAxiosError || !!error.response || error.message.includes('axios'));
      setOwners([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    owners,
    isLoading,
    isAxiosError,
    refetch: fetchOwners
  };

  return (
    <OwnerDataContext.Provider value={value}>
      {children}
    </OwnerDataContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useOwnerData = () => {
  const context = useContext(OwnerDataContext);
  if (!context) {
    throw new Error('useOwnerData must be used within OwnerDataProvider');
  }
  return context;
};

