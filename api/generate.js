import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Only POST allowed",
    });
  }

  try {
    const { prompt } = req.body;

    const result = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt || "Create a cute commercial illustration.",
      size: "1024x1024",
      n: 1,
    });

    const imageUrl = result.data?.[0]?.url;

    if (!imageUrl) {
      throw new Error("No image URL returned from OpenAI");
    }

    return res.status(200).json({
      imageUrl,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Image generation failed",
      detail: error.message,
    });
  }
}