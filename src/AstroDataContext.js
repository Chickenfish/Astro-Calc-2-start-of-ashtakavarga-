import React, { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const AstroDataContext = createContext();

export const useAstroData = () => useContext(AstroDataContext);

export const AstroDataProvider = ({ children }) => {
  const [astroData, setAstroData] = useState({});

  const updateAstroData = (newData) => {
    setAstroData(newData);
  };

  AstroDataProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return (
    <AstroDataContext.Provider value={{ astroData, updateAstroData }}>
      {children}
    </AstroDataContext.Provider>
  );
};
