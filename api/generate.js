import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  return Response.json(
    { error: "Only POST allowed" },
    { status: 405 }
  );
}

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
    });

    const image = result.data?.[0];

if (!image) {
  throw new Error("No image returned from OpenAI");
}

const imageUrl = image.url
  ? image.url
  : `data:image/png;base64,${image.b64_json}`;

return Response.json({
  imageUrl,
});
 catch (error) {
  console.log("FULL ERROR:", error);

  return Response.json(
    {
      error: "Image generation failed",
      detail: error.message,
      full: JSON.stringify(error, null, 2),
    },
    { status: 500 }
  );
}
}