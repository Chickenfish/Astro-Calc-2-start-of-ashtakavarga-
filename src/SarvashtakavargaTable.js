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
    "Total",
  ];
  SarvashtakavargaTable.propTypes = {
    data: PropTypes.object.isRequired, // Adjust according to the actual expected type
  };
  return (
    <table className="sarvatable">
      <thead>
        <tr>
          <th>Planet</th>
          {zodiacOrder.map((sign) => (
            <th key={sign}>{sign}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Object.entries(data).map(([planet, values], index) => (
          <tr key={planet} className={index % 2 === 0 ? "even-row" : ""}>
            <td>{planet}</td>
            {values.Rows.map((value, idx) => (
              <td key={idx}>{value}</td>
            ))}
            <td>{values.Total}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SarvashtakavargaTable;
