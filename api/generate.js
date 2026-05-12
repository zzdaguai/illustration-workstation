import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Only POST requests are allowed",
    });
  }

  try {
    const { prompt } = req.body;

    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
    });

    console.log(
      "OPENAI RAW RESULT:",
      JSON.stringify(result, null, 2)
    );

    const image = result.data?.[0];

    if (!image?.b64_json) {
      throw new Error("No base64 image returned from OpenAI");
    }

    const imageUrl = `data:image/png;base64,${image.b64_json}`;

    return res.status(200).json({
      imageUrl,
    });
  } catch (error) {
    console.log("OPENAI ERROR:", error);

    return res.status(500).json({
      error: "Image generation failed",
      detail: error.message,
    });
  }
}