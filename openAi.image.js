import OpenAI from "openai";
import "dotenv/config";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  const image = await openai.images.generate({
    model: "dall-e-3",
    prompt: "A cute baby sea otter",
  });

  console.log(image.data);
}
main();
