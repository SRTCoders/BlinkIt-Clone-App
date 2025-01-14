import axios from "axios";

const API_KEY = "1ljAsNkC9uoECNquxw7EAdG4OCUDiqK9mZoLQvME1ps"; // Replace with your Unsplash API Key
const BASE_URL = "https://api.unsplash.com";

// Utility function to format the URL with query parameters
const formatUrl = (params, baseUrl) => {
  const url = new URL(baseUrl);
  if (params) {
    Object.keys(params).forEach((key) => {
      const value = key === "query" ? encodeURIComponent(params[key]) : params[key];
      url.searchParams.append(key, value);
    });
  }
  return url.toString();
};

// Utility function for API calls
export const apiCall = async (endpoint, params) => {
  const apiUrl = `${BASE_URL}${endpoint}`;
  const defaultParams = {
    client_id: API_KEY,
    per_page: 1,
  };
  const finalParams = { ...defaultParams, ...params };

  try {
    const url = formatUrl(finalParams, apiUrl);
    const response = await axios.get(url);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Got error:", error.message);
    return { success: false, msg: error.message };
  }
};

// Function to fetch a random photo
const getRandomPhoto = async () => {
  const result = await apiCall("/photos/random", {}); // Endpoint for random photo
  if (result.success) {
    console.log("Random Photo URL:", result.data.urls.full);
    return result.data;
  } else {
    console.error("Error fetching random photo:", result.msg);
    return null;
  }
};

// Example usage
(async () => {
  console.log("Fetching a random photo...");
  const photo = await getRandomPhoto();
  if (photo) {
    console.log("Photo Details:");
    console.log(`ID: ${photo.id}`);
    console.log(`Description: ${photo.description || "No description available"}`);
    console.log(`URL: ${photo.urls.full}`);
  }
})();
