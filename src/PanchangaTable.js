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

  const renderPanchangaRow = (key, value) => {
    if (key === "Tithi") {
      return (
        <tr key={key}>
          <td>{key}</td>
          <td>{renderTithiDetails(value)}</td>
        </tr>
      );
    } else {
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
  };

  // Define the order of the rows
  const rowOrder = ["Tithi", "Vara", "Nakshatra", "Yoga", "Karana"];

  return (
    <table className="base-table">
      <tbody>
        {rowOrder.map((key) => {
          const value = panchangaData[key];
          if (value) {
            return renderPanchangaRow(key, value);
          }
          return null;
        })}
      </tbody>
    </table>
  );
};

PanchangaTable.propTypes = {
  panchangaData: PropTypes.object.isRequired,
};

export default PanchangaTable;
