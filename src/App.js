import React, { useEffect, useRef, useState } from "react";
import { useAstroData } from "./AstroDataContext"; //This stores a global state for the form data
import { calculateSouthIndianChart, modifySvg } from "./AstroApiService"; //This calls the kundli api and modifies it (todo keep backing vector)
import "./styles.css";

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
          types: ["(cities)"],
        },
      );
      autocomplete.current.addListener("place_changed", () => {
        const place = autocomplete.current.getPlace();
        const city = place.address_components?.find((comp) =>
          comp.types.includes("locality"),
        )?.long_name;
        const country = place.address_components?.find((comp) =>
          comp.types.includes("country"),
        )?.long_name;
        const locationValue = city && country ? `${city}, ${country}` : "";
        setValue(locationValue);
        onChange(locationValue);
      });
    }
  }, [onChange]);

  const handleChange = (e) => {
    const inputValue = e.target.value;
    setValue(inputValue);
    onChange(inputValue);
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
  const [kundliSvg, setKundliSvg] = useState("");

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
    const kundliResponse = await calculateSouthIndianChart(astroData);
    const modifiedSvg = modifySvg(kundliResponse); // Modify the SVG
    setKundliSvg(modifiedSvg); // Update the state with the modified SVG
    updateAstroData(formattedData); // Update the global state with formatted data
    console.log("Data submitted:", formattedData);
  };

  const handleDebugClick = () => {
    console.log("Current Global State:", astroData);
  };
  useEffect(() => {
    console.log("Global State updated:", astroData);
  }, [astroData]); // Logs every time astroData changes

  return (
    <div className="App">
      <h1>Enter Birth Details:</h1>
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
      <button onClick={handleDebugClick}>Debug Global State</button>
      {kundliSvg && (
        <div
          className="kundli-svg-container"
          key={Date.now()}
          dangerouslySetInnerHTML={{ __html: kundliSvg }}
        />
      )}
    </div>
  );
}
