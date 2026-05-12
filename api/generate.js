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
  const detail =
    error?.response?.data ||
    error?.error ||
    error?.message ||
    error;

  console.log("OPENAI_ERROR_DETAIL:", detail);

  return Response.json(
    {
      error: "Image generation failed",
      detail,
    },
    { status: 500 }
  );
}
}