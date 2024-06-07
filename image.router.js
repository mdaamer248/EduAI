import { Router } from "express";
import { generateImage } from "./limeWire.image.js";
import { getImageFromPrompt, getImageUrl } from "./textToImage.js";
const router = Router();

router.post("/generate/process_id", async (req, res) => {
  try {
    const imageUrl = await getImageFromPrompt(req.body.prompt);
    res.status(200).send(imageUrl);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/generate/url", async (req, res) => {
  try {
    const imageUrl = await getImageUrl(req.body.process_id);
    res.status(200).send(imageUrl);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/generate/image", async (req, res) => {
  try {
    const imageUrl = await generateImage(req.body.prompt);
    res.status(200).send(imageUrl);
  } catch (error) {
    res.status(400).send(error);
  }
});

export const imageRouter = router;
