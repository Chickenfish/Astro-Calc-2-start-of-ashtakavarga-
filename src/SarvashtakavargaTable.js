import React from "react";
import PropTypes from "prop-types";

const SarvashtakavargaTable = ({ data }) => {
  const zodiacOrder = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
    // Removed "Total" from the zodiac order
  ];

  // Filter out the "Ascendant" and "Sarvashtakavarga" rows from the data
  const filteredData = Object.entries(data).filter(([planet]) => planet !== "Ascendant" && planet !== "Sarvashtakavarga");

  return (
    <table className="base-table">
      <thead>
        <tr>
          <th>Planet</th>
          {zodiacOrder.map((sign) => (
            <th key={sign}>{sign}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {filteredData.map(([planet, values], index) => (
          <tr key={planet} className={index % 2 === 0 ? "even-row" : ""}>
            <td>{planet}</td>
            {values.Rows.map((value, idx) => (
              <td key={idx}>{value}</td>
            ))}
            {/* Removed the cell for Total */}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

SarvashtakavargaTable.propTypes = {
  data: PropTypes.object.isRequired,
};

export default SarvashtakavargaTable;
