import { createContext, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface QuoteContextType {
  openModal: () => void;
  closeModal: () => void;
  isModalOpen: boolean;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export const QuoteProvider = ({ children }: { children: React.ReactNode }) => {
  // Navigate to /request-quote instead of opening a modal
  const navigate = useNavigate();
  const openModal = useCallback(() => navigate('/request-quote'), [navigate]);
  const closeModal = useCallback(() => {}, []);

  return (
    <QuoteContext.Provider value={{ isModalOpen: false, openModal, closeModal }}>
      {children}
    </QuoteContext.Provider>
  );
};

export const useQuote = () => {
    const context = useContext(QuoteContext);
    if (!context) throw new Error('useQuote must be used within a QuoteProvider');
    return context;
};
