import React, { createContext, useContext, useState } from 'react';

const AstroDataContext = createContext();

export const useAstroData = () => useContext(AstroDataContext);

export const AstroDataProvider = ({ children }) => {
  const [astroData, setAstroData] = useState({});

  const updateAstroData = (newData) => {
    setAstroData(newData);
  };

  return (
    <AstroDataContext.Provider value={{ astroData, updateAstroData }}>
      {children}
    </AstroDataContext.Provider>
  );
};
