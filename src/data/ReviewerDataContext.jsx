import { createContext, useContext, useState, useEffect } from 'react';
import { useReviewerService } from '../middleware/reviewer/reviewerServiceHooks';

const ReviewerDataContext = createContext();

export const ReviewerDataProvider = ({ children }) => {
  const [reviewers, setReviewers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAxiosError, setIsAxiosError] = useState(false);
  
  const reviewerService = useReviewerService();

  const fetchReviewers = async () => {
    setIsLoading(true);
    setIsAxiosError(false);
    try {
      const reviewersData = await reviewerService.getAllReviewers();
      setReviewers(reviewersData);
    } catch (error) {
      console.error("Error fetching reviewers:", error);
      setIsAxiosError(error.isAxiosError || !!error.response || error.message.includes('axios'));
      setReviewers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    reviewers,
    isLoading,
    isAxiosError,
    refetch: fetchReviewers
  };

  return (
    <ReviewerDataContext.Provider value={value}>
      {children}
    </ReviewerDataContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useReviewerData = () => {
  const context = useContext(ReviewerDataContext);
  if (!context) {
    throw new Error('useReviewerData must be used within ReviewerDataProvider');
  }
  return context;
};

