import axios from "axios";
import FormData from "form-data";
import "dotenv/config";

const delay = (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time);
  });
};

export const getImageFromPrompt = async (prompt) => {
  try {
    const data = new FormData();
    data.append("prompt", `${prompt}`);
    data.append("aspect_ratio", "portrait");
    data.append("guidance_scale", "12.5");

    const config = {
      method: "post",
      url: "https://api.monsterapi.ai/v1/generate/txt2img",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${process.env.MONSTER_API_KEY}`,
        ...data.getHeaders(),
      },
      data: data,
    };

    const response = await axios(config);
    return response.data.process_id;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getImageUrl = async (status_url) => {
  try {
    const config = {
      method: "get",
      url: `https://api.monsterapi.ai/v1/status/${status_url}`,
      headers: {
        Authorization: `Bearer ${process.env.MONSTER_API_KEY}`,
      },
    };

    const imageUrls = await axios(config);
    return imageUrls.data.result.output[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};
