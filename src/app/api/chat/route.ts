import { Resume } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

export async function POST(req: NextRequest) {
  // Extract the `prompt` from the body of the request
  const body = await req.json();
  const query = body.parsedText;
  const jobDescription = body.jobDescription || body.jobLink;
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    temperature: 1,
    messages: [
      {
        role: "system",
        content: `You are a helpful AI assistant that can improvise resume suggestions.`,
      },
      {
        role: "user",
        content: `Given a resume as input (${query}), extract and enhance the relevant information to create a structured JSON output tailored to the job title of ${jobDescription}. The JSON should follow this format:

{
  "description": {
    "firstName": "string",
    "lastName": "string",
    "jobRole": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "state": "string",
    "city": "string",
    "zipCode": "string"
  },
  "summary": ["string", "string", "string"],
  "skills": {skillName : "string", added: boolean, id: number}[],
  "skillsTable": {skillCategory : "string", skills : string[]}[], 
  "missingSkills": {skillName : "string", added: boolean, id: number}[],
  "nonRelevantSkills": {skillName : "string", added: boolean, id: number}[],
  "education": [
    {
      "degreeName": "string",
      "institution": "string",
      "location": "string",
      "graduationDate": "string",
      "descriptions": [
        {
          "text": "string",
          "aiEnhanced": "string"
        }
      ]
    }
  ],
  "workExperience": [
    {
      "jobRole": "string",
      "organizationName": "string",
      "startDate": "string",
      "endDate": "string",
      "descriptions": [
        {
          "text": "string",
          "aiEnhanced": "string"
        }
      ]
    }
  ]
}

Instructions:
1. Parse the input resume text thoroughly.
2. Extract and categorize ALL relevant information into the appropriate JSON fields.
3. Make sure you give minimum three elements in the "summary" array with every element being maximum 100 words. Use everything in the query to generate the summary tailored to ${jobDescription}. Every summary is a variagtion of other.
4. Ensure that ALL education entries are captured, with each being a separate object in the "education" array.
5. For each education entry, include ALL relevant descriptions or bullet points. Each description should be a separate object in the "descriptions" array of that education entry.
6. Capture ALL work experiences, with each being a separate object in the "workExperience" array. Ensure you return descriptions in the "descriptions" array of each work experience each description being taken into consideration as a seperate entity.
7. For each work experience, include ALL descriptions or bullet points provided in the resume. Each description should be a separate object in the "descriptions" array of that work experience.
8. For EACH description in both "education" and "workExperience":
   - Include the original text in the "text" field.
   - Provide an enhanced, rewritten version of the text in the "aiEnhanced" field. This should be a complete replacement, not just suggestions.
9. Enhance the extracted information throughout, providing more detailed, professional, or improved content where possible.
10. Identify top 20 important skills mentioned in the resume which suit the ${jobDescription} and list them in the "skills" array. Ensure that the added field is set to true. 
11. In the "skillsTable" array, take the same skills from the skills section, categorize them in a meaningful way as Technical Skills and Soft Skills only and provide it in the required format.
12. Based on the ${jobDescription} and experience, suggest a minimum of 10 relevant skills that might be missing from the resume and include them in the "missingSkills" array. Ensure that the added field is set to false. Start the id from the next number from where the id ends in "skills" array.
13. Based on the ${jobDescription} and experience, put the non-relevant skills in the resume in the "nonRelevantSkills" array. Ensure that the added field is set to false. Start the id from the next number from where the id ends in "missingSkills" array.
14. Ensure all date formats are consistent (e.g., DD-MM-YYYY or YYYY). Use "Present" for current positions.
15. If any information is not available in the input, use an empty string or array as appropriate.

Return the completed JSON structure with ALL available and enhanced information from the resume, ensuring no education, work experience, or individual description is omitted. Each "aiEnhanced" field should contain a complete, improved version of its corresponding original text. Do not return any text in the response. Only return the JSON Structure`,
      },
    ],
  });

  let json: Resume | null = null;

  try {
    json = JSON.parse(
      response?.choices?.[0]?.message?.content!.split("```json")[1]
        ? response?.choices?.[0]?.message?.content!.split("```json")[1]
        : response?.choices?.[0]?.message?.content || "",
    );

    if (!json) {
      return NextResponse.json(
        {
          status: false,
          message: "Error parsing roadmap data.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ status: true, text: json }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        status: false,
        message: "Error parsing roadmap data.",
      },
      { status: 500 },
    );
  }
}
