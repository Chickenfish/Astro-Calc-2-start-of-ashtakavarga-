import React from "react";
import PropTypes from "prop-types";

const PlanetDataTable = ({ planetData }) => {
  // Define the order of the planets as per Vedic Astrology
  const planetsOrder = [
    "Sun",
    "Moon",
    "Mars",
    "Mercury",
    "Jupiter",
    "Venus",
    "Saturn",
    "Rahu",
    "Ketu",
  ];

  return (
    <table className="base-table">
      <thead>
        <tr>
          <th>Planet</th>
          <th>Sign</th>
          <th>Nakshatra</th>
        </tr>
      </thead>
      <tbody>
        {planetsOrder.map((planet) => {
          const data = planetData.find((p) => p[planet]);
          if (data) {
            const planetInfo = data[planet];
            const signDegrees =
              planetInfo.PlanetZodiacSign.DegreesIn.DegreeMinuteSecond;
            const signName = planetInfo.PlanetZodiacSign.Name;
            const nakshatra = planetInfo.PlanetConstellation;
            return (
              <tr key={planet}>
                <td>{planet}</td>
                <td>{`${signDegrees} ${signName}`}</td>
                <td>{nakshatra}</td>
              </tr>
            );
          }
          return null; // In case the planet data is not found
        })}
      </tbody>
    </table>
  );
};

PlanetDataTable.propTypes = {
  planetData: PropTypes.array.isRequired,
};

export default PlanetDataTable;
