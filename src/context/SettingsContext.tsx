import { createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const DEFAULT_LOGO = "/logo.png";

interface SettingsContextType {
  logoUrl: string;
  activeSeasonalEffect: string;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [logoUrl, setLogoUrl] = useState(DEFAULT_LOGO);
  const [activeSeasonalEffect, setActiveSeasonalEffect] = useState('none');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'content', 'settings'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.logoUrl && !data.logoUrl.includes('Alliance%20Freigh')) {
          setLogoUrl(data.logoUrl);
        } else {
          setLogoUrl('/logo.png');
        }
        if (data.activeSeasonalEffect) setActiveSeasonalEffect(data.activeSeasonalEffect);
      } else {
        setLogoUrl('/logo.png');
      }
      setLoading(false);
    }, (error) => {
      console.error("Failed to load settings:", error);
      setLogoUrl('/logo.png');
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <SettingsContext.Provider value={{ logoUrl, activeSeasonalEffect, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};
