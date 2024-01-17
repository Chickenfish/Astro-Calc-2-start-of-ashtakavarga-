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
  const apiURL = `https://api.vedastro.org/Calculate/SarvashtakavargaChart/Location/${encodeURIComponent(astroData.location)}/Time/${encodeURIComponent(astroData.time)}/${encodeURIComponent(astroData.date)}`;

  try {
    const response = await axios.get(apiURL);
    if (response.data.Status === "Pass") {
      return processSarvashtakavargaData(response.data.Payload.SarvashtakavargaChart);
    } else {
      // Handle API response failure
      console.error("API call failed:", response.data);
      return null;
    }
  } catch (error) {
    console.error("Error fetching Sarvashtakavarga data:", error);
    return null;
  }
};
const processSarvashtakavargaData = (data) => {
  const processedData = Object.entries(data).map(([planet, values]) => {
    return {
      planet,
      total: values.Total,
      rows: values.Rows
    };
  });

  return processedData;
};