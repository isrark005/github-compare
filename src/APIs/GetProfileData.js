import axios from "axios";

export const GetProfileData = async (userName) => {
  try {
    const response = await axios.get(
      `https://github-contributions-api.jogruber.de/v4/${userName}`,
    );
    return response.data;
  } catch (error) {
    console.error("some error:", error);
    throw error;
  }
};

export const GetGitHubInfo = async (userName) => {
  try {
    const response = await axios.get(
      `https://api.github.com/users/${userName}`,
    );
    return response.data;
  } catch (error) {
    console.error("some error:", error);
    throw error;
  }
};