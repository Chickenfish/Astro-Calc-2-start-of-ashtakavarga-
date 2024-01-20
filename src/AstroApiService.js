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

  // Get all 'path' elements and remove them
  const paths = xmlDoc.getElementsByTagName("path");
  Array.from(paths).forEach((path) => {
    path.parentNode.removeChild(path);
  });

  // Get all 'polygon' elements
  const polygons = xmlDoc.getElementsByTagName("polygon");
  Array.from(polygons).forEach((polygon) => {
    // Only remove a polygon if its parent is not the 'lines' element
    if (polygon.parentNode.id !== "lines") {
      polygon.parentNode.removeChild(polygon);
    } else {
      // If the polygon is a child of the 'lines' element, set its stroke to black
      polygon.style.stroke = "black";
    }
  });

  // Find the 'lines' element and modify the 8th line child
  const lines = xmlDoc.getElementById("lines");
  if (lines) {
    const lineElements = Array.from(lines.getElementsByTagName("line"));
    if (lineElements.length >= 8) {
      // Assuming the children are indexed from 0, the 8th element has an index of 7
      lineElements[7].setAttribute("x2", "970");
    }
  }

  // Find the SignLayer element and process its children
  const signLayer = xmlDoc.getElementById("SignLayer");
  if (signLayer) {
    Array.from(signLayer.children).forEach((child) => {
      if (!["SignNames", "lines"].includes(child.id)) {
        signLayer.removeChild(child);
      }
    });
  }

  // Change fill and stroke of all elements to black, except for excluded ones and lines' polygons
  Array.from(xmlDoc.querySelectorAll("*")).forEach((el) => {
    const isLinesPolygon =
      el.tagName === "polygon" && el.parentNode.id === "lines";
    if (
      !["Prerender", "DarkBack", xmlDoc.documentElement, "lines"].includes(
        el.id,
      ) &&
      !isLinesPolygon
    ) {
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

export const fetchAllPlanetData = async (astroData) => {
  const planetDataUrl = `https://api.vedastro.org/Calculate/AllPlanetData/PlanetName/All/Location/${encodeURIComponent(astroData.location)}/Time/${encodeURIComponent(astroData.time)}/${encodeURIComponent(astroData.date)}/+10:00`;

  try {
    const response = await axios.get(planetDataUrl);
    return response.data.Payload.AllPlanetData;
  } catch (error) {
    console.error("Error fetching all planet data:", error);
    return null;
  }
};
