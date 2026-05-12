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

    return Response.json({
      imageUrl: `data:image/png;base64,${result.data[0].b64_json}`,
    });
  } catch (error) {
    return Response.json(
      {
        error: "Image generation failed",
        detail: error.message,
      },
      { status: 500 }
    );
  }
}