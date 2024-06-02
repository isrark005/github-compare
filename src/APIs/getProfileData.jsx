import axios from "axios";

export const GetProfileData = async (userName) => {
  try {
    const response = await axios.get(
      `http://github-contributions-api.jogruber.de/v4/${userName}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};