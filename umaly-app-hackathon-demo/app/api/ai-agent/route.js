import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI
// Ensure OPENAI_API_KEY is in your .env.local file
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { agentType, context } = await req.json();
    let systemPrompt = "";
    let userPrompt = "";

    // --- AGENT 1: THE DEMAND PLANNER (Dashboard) ---
    if (agentType === 'planner') {
      systemPrompt = `You are a Supply Chain Analyst for 'Cacao de Davao' or 'FROG KAFFEE'. 
      Analyze inventory levels vs daily burn rate.
      
      Rules:
      1. Calculate Days of Inventory (Stock / Burn Rate).
      2. If Days < 7, status is CRITICAL. Recommend a specific PO amount.
      3. If Days >= 7, status is HEALTHY. Provide a market trend insight.
      
      Output JSON format: { "status": "Critical" | "Healthy", "doi": number, "insight": "string", "recommendation": "string" }`;
      
      userPrompt = `Current Stock: ${context.stock}kg. Daily Burn: ${context.burnRate}kg. Active Orders: ${context.pendingOrders}kg.`;
    }

    // --- AGENT 2: THE HARVEST SCOUT (Farmer Chat) ---
    else if (agentType === 'scout') {
      systemPrompt = `You are 'Umaly', a friendly field coordinator speaking in Taglish/Bisaya.
      Your goal: Convince the farmer to harvest early because of incoming demand or weather.
      Keep it short (SMS style, max 160 chars).
      
      Context: Weather is ${context.weather}. Factory demand is high.`;

      userPrompt = `Draft a message for Farmer ${context.farmerName}. Last harvest was ${context.lastHarvest}.`;
    }

    // --- AGENT 3: THE VARIANCE AUDITOR (Receiving) ---
    else if (agentType === 'auditor') {
      systemPrompt = `You are a Quality Control Auditor. Analyze shipment variance.
      Rules:
      - Allow 1-2% moisture loss for Wet Beans.
      - Flag >5% variance as 'Suspicious'.
      - Flag positive variance (Received > Dispatched) as 'Scale Error'.
      
      Output JSON: { "verdict": "Pass" | "Investigate", "reason": "string" }`;

      userPrompt = `Dispatched: ${context.dispatched}kg. Received: ${context.received}kg. Crop: ${context.cropState}.`;
    }

    // --- CALL OPENAI ---
    // We use a simple completion call. 
    // Note: For production, we'd use more robust error handling.
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Use "gpt-3.5-turbo" if you don't have GPT-4 access
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      // Force JSON mode for Planner/Auditor, Text for Scout
      response_format: agentType !== 'scout' ? { type: "json_object" } : { type: "text" },
    });

    const result = completion.choices[0].message.content;
    
    // Parse JSON if needed before sending back
    const responseData = agentType !== 'scout' ? JSON.parse(result) : { message: result };
    
    return NextResponse.json(responseData);

  } catch (error) {
    console.error('AI Error:', error);
    // Fallback mock response so the app doesn't crash if OpenAI fails/has no credits
    return NextResponse.json({ 
        message: "AI Service Unavailable (Check API Key)",
        insight: "System offline. Using manual overrides.",
        status: "Healthy"
    }, { status: 200 }); // Return 200 even on error to keep UI alive
  }
}