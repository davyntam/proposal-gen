import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Create OpenAI client with your API key
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { service, jobDescription, freelancerName, experience } = body;

    // Build the prompt
    const prompt = `
Write a professional, persuasive freelance proposal.

Service: ${service}
Job Description: ${jobDescription}

Freelancer Info:
- Name: ${freelancerName}
- Experience: ${experience}

Format:
1. Friendly greeting
2. Why you’re a great fit
3. Brief plan for the project
4. Call to action
    `;

    // Call OpenAI Chat Completions
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert proposal writer that helps freelancers win clients.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 400, // limit so you don’t overspend
      temperature: 0.7,
    });

    // Extract the output safely
    const output = completion.choices[0]?.message?.content?.trim();

    if (!output) {
      return NextResponse.json({ proposal: "⚠ No text returned from OpenAI." });
    }

    return NextResponse.json({ proposal: output });
  } catch (err: any) {
    console.error("❌ API Error:", err);
    return NextResponse.json(
      { error: err.message || "Something went wrong." },
      { status: 500 }
    );
  }
}
