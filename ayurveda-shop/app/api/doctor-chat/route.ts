import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyBoFCd4FRy5r6EJAIWsobrSTrYQ4rZtECk";

interface Message {
  role: string;
  content: string;
}

const SYSTEM_INSTRUCTION = `You are Dr. AI, an Ayurvedic health assistant integrated into an Ayurveda eCommerce website.

CRITICAL RULES:
1. ONLY respond to health, wellness, symptoms, Ayurveda, and herbal remedies questions
2. For non-medical topics, politely redirect: "I'm here to help with health and wellness topics only. How can I assist you with your health today?"
3. Provide empathetic, informative responses about symptoms and Ayurvedic approaches
4. Always include appropriate disclaimers that you're not a substitute for professional medical advice
5. For URGENT symptoms (chest pain, severe bleeding, breathing difficulties, loss of consciousness), IMMEDIATELY advise seeking emergency medical care
6. Suggest natural Ayurvedic remedies when appropriate, but emphasize consulting healthcare professionals for serious conditions
7. Keep responses concise (2-4 paragraphs maximum)
8. Use a warm, professional tone with occasional relevant emojis (🌿, 💚, 🧘‍♀️)
9. Reference Ayurvedic principles like doshas (Vata, Pitta, Kapha), prakriti, and holistic wellness when relevant
10. When appropriate, suggest consulting with a qualified Ayurvedic practitioner or medical doctor

Remember: You provide guidance and education, NOT diagnosis or treatment. Patient safety is paramount.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history = [] } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Build contents array for Gemini API
    const contents: any[] = [];

    // Add system instruction as first user message
    contents.push({
      role: "user",
      parts: [{ text: SYSTEM_INSTRUCTION }]
    });

    contents.push({
      role: "model",
      parts: [{ text: "Understood. I am Dr. AI, your Ayurvedic health assistant. I will only discuss health, wellness, and Ayurveda topics, providing helpful guidance while prioritizing your safety. How can I help you today?" }]
    });

    // Add recent conversation history (last 4 messages)
    const recentHistory = history.slice(-4);
    for (const msg of recentHistory) {
      contents.push({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      });
    }

    // Add current user message
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    console.log("Calling Gemini 2.0 Flash API with", contents.length, "messages");

    // Call Gemini API using the exact format from the curl example
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 500,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API error:", errorData);

      return NextResponse.json(
        {
          error: "AI service error",
          response: "I apologize, but I'm having trouble connecting to the AI service. Please try again in a moment. If this is urgent, please consult a healthcare professional immediately. 💚"
        },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log("Gemini API response received");

    // Extract AI response
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error("Unexpected API response format:", JSON.stringify(data));
      return NextResponse.json(
        {
          error: "Invalid response format",
          response: "I apologize, but I received an unexpected response. Please try again. 💚"
        },
        { status: 500 }
      );
    }

    const aiResponse = data.candidates[0].content.parts[0].text;

    return NextResponse.json({
      response: aiResponse,
      timestamp: new Date().toISOString(),
      model: "gemini-2.0-flash-exp",
    });

  } catch (error: any) {
    console.error("Doctor chat API error:", error);

    let errorMessage = "I apologize, but I'm having trouble connecting right now.";

    if (error.message?.includes("API key")) {
      errorMessage = "API authentication issue. Please check the configuration.";
    } else if (error.message?.includes("quota") || error.status === 429) {
      errorMessage = "Rate limit reached. Please try again in a moment.";
    } else if (error.code === "ENOTFOUND") {
      errorMessage = "Unable to connect to AI service. Please check your internet connection.";
    }

    return NextResponse.json(
      {
        error: "Failed to process your message",
        response: `${errorMessage} If this is urgent, please consult a healthcare professional immediately. 💚`,
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
