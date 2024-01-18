import axios from "axios";

export const calculateSouthIndianChart = async (astroData) => {
  const KundliapiUrl = `https://api.vedastro.org/Calculate/SouthIndianChart/Location/${encodeURIComponent(astroData.location)}/Time/${encodeURIComponent(astroData.time)}/${encodeURIComponent(astroData.date)}`;

  console.log("Kundli API URL:", KundliapiUrl); // Logging the URL for debugging

  try {
    const response = await axios.get(KundliapiUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching South Indian Chart:", error);
    return null;
  }
};
export const modifySvg = (svgString) => {
  // Parse the SVG string
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(svgString, "image/svg+xml");

  const paths = xmlDoc.getElementsByTagName("path");
  // Convert the live HTMLCollection to an array and remove each path element
  Array.from(paths).forEach((path) => {
    path.parentNode.removeChild(path);
  });

  const polygons = xmlDoc.getElementsByTagName("polygon");
  Array.from(polygons).forEach((polygon) => {
    polygon.parentNode.removeChild(polygon);
  });

  // Find the SignLayer element
  const signLayer = xmlDoc.getElementById("SignLayer");

  if (signLayer) {
    // Iterate over and remove all children except SignNames
    Array.from(signLayer.children).forEach((child) => {
      if (child.id !== "SignNames") {
        signLayer.removeChild(child); // Remove the child
      }
    });
  }

  // Change fill and stroke of all elements to black, except excluded ones
  Array.from(xmlDoc.querySelectorAll("*")).forEach((el) => {
    if (!["Prerender", "DarkBack", xmlDoc.documentElement].includes(el.id)) {
      el.style.fill = "black";
      el.style.stroke = "black";
    }
  });
  // Serialize back to string
  const serializer = new XMLSerializer();
  return serializer.serializeToString(xmlDoc);
};

export const fetchSarvashtakavargaData = async (astroData) => {
  const sarvashtakavargaUrl = `https://api.vedastro.org/Calculate/SarvashtakavargaChart/Location/${encodeURIComponent(astroData.location)}/Time/${encodeURIComponent(astroData.time)}/${encodeURIComponent(astroData.date)}/`;
  console.log("Calling Sarvashtakavarga API:", sarvashtakavargaUrl); // Log the URL

  try {
    const response = await axios.get(sarvashtakavargaUrl);
    return response.data.Payload.SarvashtakavargaChart;
  } catch (error) {
    console.error("Error fetching Sarvashtakavarga data:", error);
    return null;
  }
};

export const fetchDashaData = async (astroData) => {
  // Encoding the parameters
  const location = astroData.location;
  const time = astroData.time;
  const date = astroData.date;
  const currentLocation = astroData.currentLocation;
  const futureStartDate = "01/01/2024"; // Adjust if needed
  const futureEndDate = "01/01/2026"; // Adjust if needed

  // Construct the URL with encoded parameters
  const dashaUrl = `https://api.vedastro.org/Calculate/DasaAtRange/Location/${location}/Time/${time}/${date}/+10:00/Location/${currentLocation}/Time/00:00/${futureStartDate}/+10:00/Location/${currentLocation}/Time/00:00/${futureEndDate}/+10:00/levels/2/`;

  console.log("Calling Dasha API:", dashaUrl); // Log the URL

  try {
    const response = await axios.get(dashaUrl);
    return response.data.Payload.DasaAtRange;
  } catch (error) {
    console.error("Error fetching Dasha data:", error);
    return null;
  }
};

export const fetchPanchangaData = async (astroData) => {
  const panchangaUrl = `https://api.vedastro.org/Calculate/PanchangaTable/Location/${encodeURIComponent(astroData.location)}/Time/${encodeURIComponent(astroData.time)}/${encodeURIComponent(astroData.date)}/+08:00`;

  console.log("Calling Panchanga API:", panchangaUrl); // Log the URL

  try {
    const response = await axios.get(panchangaUrl);
    return response.data.Payload.PanchangaTable;
  } catch (error) {
    console.error("Error fetching Panchanga data:", error);
    return null;
  }
};
