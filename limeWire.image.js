import axios from "axios";
import "dotenv/config";

export const generateImage = async (prompt) => {
  try {
    const data = JSON.stringify({
      prompt,
      aspect_ratio: "1:1",
    });

    const config = {
      method: "post",
      url: "https://api.limewire.com/api/image/generation",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.LIMEWIRE_API_KEY}`,
        "Content-Type": "application/json",
        "X-Api-Version": "v1",
      },
      data,
    };

    const response = await axios(config);

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
