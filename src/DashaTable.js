import React from "react";
import PropTypes from "prop-types";

const DashaTable = ({ dashaData }) => {
  const formatDate = (dateTimeString) => {
    const datePart = dateTimeString.match(/(\d{2}\/\d{2}\/\d{4})/); // Regular expression to extract date in DD/MM/YYYY format
    return datePart ? datePart[0] : ""; // Returns the extracted date part
  };

  const renderSubDasas = (subDasas) => {
    return (
      <>
        <tr>
          <th>Minor Lords</th>
          <th>Start</th>
          <th>End</th>
        </tr>
        {Object.entries(subDasas).map(([key, value]) => (
          <tr key={key}>
            <td>{value.Lord}</td>
            <td>{formatDate(value.Start)}</td>
            <td>{formatDate(value.End)}</td>
          </tr>
        ))}
      </>
    );
  };

  const tableRows = Object.entries(dashaData).map(([majorLord, details]) => (
    <React.Fragment key={majorLord}>
      <tr>
        <td>{details.Lord}</td>
        <td>{formatDate(details.Start)}</td>
        <td>{formatDate(details.End)}</td>
      </tr>
      {details.SubDasas ? renderSubDasas(details.SubDasas) : null}
    </React.Fragment>
  ));

  return (
    <table className="base-table">
      <thead>
        <tr>
          <th>Major Lord</th>
          <th>Start</th>
          <th>End</th>
        </tr>
      </thead>
      <tbody>{tableRows}</tbody>
    </table>
  );
};

DashaTable.propTypes = {
  dashaData: PropTypes.object.isRequired,
};

export default DashaTable;
