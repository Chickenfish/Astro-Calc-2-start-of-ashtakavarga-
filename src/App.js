import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import "./styles.css";

import {
  calculateSouthIndianChart,
  modifySvg,
  fetchSarvashtakavargaData,
  fetchDashaData,
  fetchPanchangaData,
  fetchAllPlanetData,
} from "./AstroApiService";
import { useAstroData } from "./AstroDataContext";
import SarvashtakavargaTable from "./SarvashtakavargaTable";
import DashaTable from "./DashaTable";
import PanchangaTable from "./PanchangaTable"; // Import the PanchangaTable component
import PlanetDataTable from "./PlanetDataTable";

const FormInput = ({
  labelText,
  placeholder,
  onChange,
  type = "text",
  min,
  max,
  isLocation = false,
}) => {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);
  const autocomplete = useRef(null);

  useEffect(() => {
    if (isLocation) {
      autocomplete.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["(regions)"],
        },
      );
      autocomplete.current.addListener("place_changed", () => {
        const place = autocomplete.current.getPlace();
        const city = place.address_components?.find((comp) =>
          comp.types.includes("locality"),
        )?.long_name;
        const state = place.address_components?.find((comp) =>
          comp.types.includes("sublocality"),
        )?.long_name;
        const country = place.address_components?.find((comp) =>
          comp.types.includes("country"),
        )?.long_name;

        // Concatenate city, state, and country. Include state only if it's available
        const locationValue = [city, state, country].filter(Boolean).join(",");
        setValue(locationValue);
        onChange(locationValue);
      });
    }
    return () => {
      if (autocomplete.current) {
        // Remove all listeners from the Autocomplete instance
        window.google.maps.event.clearInstanceListeners(autocomplete.current);
      }
    };
  }, [onChange, isLocation]);

  const handleChange = (e) => {
    const inputValue = e.target.value;
    setValue(inputValue);
    if (!isLocation) {
      onChange(inputValue);
    }
  };
  FormInput.propTypes = {
    labelText: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    type: PropTypes.string,
    min: PropTypes.string,
    max: PropTypes.string,
    isLocation: PropTypes.bool,
  };
  return (
    <label>
      {labelText}:{" "}
      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        min={min}
        max={max}
      />
    </label>
  );
};

export default function App() {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    location: "",
    currentLocation: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [kundliSvg, setKundliSvg] = useState("");
  const [sarvashtakavargaData, setSarvashtakavargaData] = useState(null);
  const [dashaData, setDashaData] = useState(null);
  const [panchangaData, setPanchangaData] = useState(null);
  const [planetData, setPlanetData] = useState([]);

  const { astroData, updateAstroData } = useAstroData(); // Use the global state updater

  const handleInputChange = (name) => (value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formattedData = {
      date: formData.date.split("-").reverse().join("/"), // Convert YYYY-MM-DD to DD/MM/YYYY
      time: formData.time, // Time is already in HH:MM format
      location: formData.location.replace(/, /g, ","), // Remove space after comma
      currentLocation: formData.currentLocation.replace(/, /g, ","), // Remove space after comma
    };
    updateAstroData(formattedData);
    setIsLoading(true); // Update the global state with formatted data

    const kundliResponse = await calculateSouthIndianChart(astroData);
    const modifiedSvg = modifySvg(kundliResponse); // Modify the SVG
    setKundliSvg(modifiedSvg); // Update the state with the modified SVG

    const data = await fetchSarvashtakavargaData(astroData);
    setSarvashtakavargaData(data);

    const fetchedPanchangaData = await fetchPanchangaData(astroData);
    setPanchangaData(fetchedPanchangaData);

    const fetchedPlanetData = await fetchAllPlanetData(astroData);
    setPlanetData(fetchedPlanetData || []);

    console.log("Data submitted:", formattedData);

    setTimeout(() => {
      setIsLoading(false); // Hide loading overlay after 2 seconds
    }, 2000);
  };

  const handleDebugClick = () => {
    console.log("Current Global State:", astroData);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (astroData && astroData.date && astroData.time && astroData.location) {
        // Kundli API call
        const kundliResponse = await calculateSouthIndianChart(astroData);
        if (kundliResponse) {
          const modifiedSvg = modifySvg(kundliResponse);
          setKundliSvg(modifiedSvg);
        }

        // Dasha API call
        const fetchedDashaData = await fetchDashaData(astroData);
        setDashaData(fetchedDashaData);

        // Sarvashtakavarga API call
        const sarvashtakavargaResponse =
          await fetchSarvashtakavargaData(astroData);
        setSarvashtakavargaData(sarvashtakavargaResponse);

        // Panchanga API call
        const fetchedPanchangaData = await fetchPanchangaData(astroData);
        setPanchangaData(fetchedPanchangaData);

        // Planet Data API call
        const fetchedPlanetData = await fetchAllPlanetData(astroData);
        setPlanetData(fetchedPlanetData);
      }
    };

    fetchData();
  }, [astroData]); // Dependency array includes astroData

  // Dependency array includes astroData

  return (
    <div className="App">
      <div className="form-container">
        <h1>Enter Birth Details:</h1>
        <div className="input-group">
          <form onSubmit={handleSubmit}>
            <FormInput
              labelText="Date"
              type="date"
              min="1900-01-01"
              max="2025-01-01"
              onChange={handleInputChange("date")}
            />
            <FormInput
              labelText="Time"
              type="time"
              onChange={handleInputChange("time")}
            />
            <FormInput
              labelText="Location"
              placeholder="City, Country"
              onChange={handleInputChange("location")}
              isLocation={true}
            />
            <FormInput
              labelText="Current Location"
              placeholder="City, Country"
              onChange={handleInputChange("currentLocation")}
              isLocation={true}
            />
            <FormInput
              labelText="Email Address"
              type="email"
              placeholder="youremail@example.com"
              onChange={handleInputChange("email")}
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>

      <button onClick={handleDebugClick}>Debug Global State</button>
      {isLoading && (
        <div className="loading-overlay">
          <div>Loading...</div>
          <img
            src="https://cdn.dribbble.com/users/719101/screenshots/3087499/media/a65570383f509b6586373dab2c4168e0.gif"
            alt="Loading"
          />
          </div>
      )}
      {kundliSvg && (
        <div
          className="kundli-svg-container"
          dangerouslySetInnerHTML={{ __html: kundliSvg }}
        />
      )}
      <div className="sarvashtakavargaData">
        {sarvashtakavargaData && (
          <SarvashtakavargaTable data={sarvashtakavargaData} />
        )}
      </div>
      <div className="dasha-table-container">
        {dashaData && <DashaTable dashaData={dashaData} />}
      </div>
      {panchangaData && (
        <div className="panchanga-table-container">
          <PanchangaTable panchangaData={panchangaData} />
        </div>
      )}
      <div className="planet-data-table-container">
        {planetData.length > 0 && <PlanetDataTable planetData={planetData} />}
      </div>
    </div>
  );
}