import React, { createContext, useContext, ReactNode } from 'react';

// Location Context
interface LocationContextType {
  location: any;
  isLoading: boolean;
  getCurrentLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const getCurrentLocation = async () => {
    setIsLoading(true);
    try {
      // Add location logic here
      console.log('Getting current location...');
    } catch (error) {
      console.error('Location error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    location,
    isLoading,
    getCurrentLocation,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
