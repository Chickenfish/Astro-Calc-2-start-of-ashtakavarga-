import React from "react";
import PropTypes from "prop-types";

const PanchangaTable = ({ panchangaData }) => {
  // Helper function to render Tithi details
  const renderTithiDetails = (tithiData) => {
    const details = [
      tithiData.Name,
      tithiData.Paksha,
      tithiData.Date,
      tithiData.Day,
      tithiData.Phase,
    ];
    return details.join(", ");
  };

  const renderPanchangaRows = () => {
    return Object.entries(panchangaData)
      .map(([key, value]) => {
        if (key === "Tithi") {
          // Special rendering for Tithi
          return (
            <tr key={key}>
              <td>{key}</td>
              <td>{renderTithiDetails(value)}</td>
            </tr>
          );
        } else if (!["Lunar Month", "DishaShool"].includes(key)) {
          // Render other rows normally, skipping Lunar Month and DishaShool
          return (
            <tr key={key}>
              <td>{key}</td>
              <td>
                {typeof value === "object"
                  ? `${value.Name}, ${value.Description}`
                  : value}
              </td>
            </tr>
          );
        }
        return null; // Return null for skipped entries
      })
      .filter(Boolean); // Filter out null entries
  };

  return (
    <table className="panchanga-table">
      <tbody>{renderPanchangaRows()}</tbody>
    </table>
  );
};

PanchangaTable.propTypes = {
  panchangaData: PropTypes.object.isRequired,
};

export default PanchangaTable;
