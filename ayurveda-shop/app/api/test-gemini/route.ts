import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function GET(request: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json({
        status: "error",
        message: "GEMINI_API_KEY not found in environment variables"
      });
    }

    // Test API call with simple prompt
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: "Say hello" }]
            }
          ]
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json({
        status: "error",
        message: "Gemini API error",
        details: errorData,
        apiKey: `${GEMINI_API_KEY.substring(0, 10)}...` // Show first 10 chars only
      });
    }

    const data = await response.json();

    return NextResponse.json({
      status: "success",
      message: "API key is working!",
      response: data.candidates[0].content.parts[0].text,
      apiKey: `${GEMINI_API_KEY.substring(0, 10)}...`
    });

  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      message: error.message,
      apiKey: GEMINI_API_KEY ? `${GEMINI_API_KEY.substring(0, 10)}...` : "not set"
    });
  }
}
