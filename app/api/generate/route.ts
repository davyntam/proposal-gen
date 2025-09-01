import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    // Explicitly type the body
    const body: {
      service: string;
      jobDescription: string;
      freelancerName: string;
      experience: string;
    } = await req.json();

    const { service, jobDescription, freelancerName, experience } = body;

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

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert proposal writer that helps freelancers win clients.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 400,
      temperature: 0.7,
    });

    // Explicitly type the output
    const output: string | undefined = completion.choices[0]?.message?.content?.trim();

    if (!output) {
      return NextResponse.json({ proposal: "⚠ No proposal returned from OpenAI." });
    }

    return NextResponse.json({ proposal: output });
  } catch (err: unknown) {
    console.error("❌ API Error:", err);

    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }

    return NextResponse.json({ error: "Unknown error occurred" }, { status: 500 });
  }
}
