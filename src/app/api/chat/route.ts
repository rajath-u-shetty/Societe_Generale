import { AiResponse } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const regulationsText = body.regulationsText;
  const sopItems = body.sopItems;
  const name = body.name;

  console.log("body", body);
  console.log("regulationsText", regulationsText); 
  console.log("sopItems", sopItems);

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content: `You are an AI assistant specialized in improving Standard Operating Procedures (SOPs) based on given regulations. Your task is to analyze, enhance, and score SOPs.`,
      },
      {
        role: "user",
        content: `Given the following regulations and SOP items, please perform these tasks:

1. Analyze the provided SOP items in relation to the regulations.
2. Enhance the SOP items to better align with the regulations.
3. Score the original SOP items based on their compliance with the regulations.

Regulations Text:
${regulationsText}

Original SOP Items:
${JSON.stringify(sopItems)}

Please provide your response in the following JSON format:

{
  "givenSopItems": [
    { "name": "string", "id": number }
  ],
  "enhancedSopItems": [
    { "name": "string", "id": number }
  ],
  "scoreOfEnteredSOPItems": number
}

Instructions:
- givenSopItems: Include the original SOP items as provided.
- enhancedSopItems: Provide improved versions of the SOP items that better align with the regulations. Maintain the original structure but modify the content as needed.
- scoreOfEnteredSOPItems: Assign a score from 0 to 100 indicating how well the original SOP items comply with the regulations.
- Return the name as it is.

Ensure your response is a valid JSON object wrapped in a code block.`,
      },
    ],
  });

  let json: AiResponse | null = null;
  try {
    const content = response?.choices?.[0]?.message?.content || "";
    const jsonString = content.includes("```json")
      ? content.split("```json")[1].split("```")[0]
      : content;
    json = JSON.parse(jsonString);

    if (!json) {
      return NextResponse.json(
        { status: false, message: "Error parsing SOP enhancement data." },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: true, text: json }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { status: false, message: "Error parsing SOP enhancement data." },
      { status: 500 }
    );
  }
}
