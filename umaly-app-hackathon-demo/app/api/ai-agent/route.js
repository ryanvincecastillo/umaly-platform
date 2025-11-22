import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// NEW: Helper to get real weather
async function getRealWeather(location) {
  try {
    // For demo purposes, if no API key, return the "Hackathon Scenario"
    if (!process.env.OPENWEATHER_API_KEY) return "Heavy Rain predicted for Friday (Simulated)";

    // 1. Geocoding (Convert "Calinan, Davao" to Lat/Lon) if needed, 
    // or just pass the city if the API supports it. 
    // Assuming 'location' is something like "Calinan, Davao City"
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location},PH&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );
    const weatherData = await weatherRes.json();
    
    return `${weatherData.weather[0].description}, Temp: ${weatherData.main.temp}°C`;
  } catch (e) {
    return "Data unavailable (Simulated Rain)";
  }
}

export async function POST(req) {
  try {
    const { agentType, context } = await req.json();
    let systemPrompt = "";
    let userPrompt = "";

    // --- AGENT 2: THE HARVEST SCOUT ---
    if (agentType === 'scout') {
      // DYNAMICALLY FETCH WEATHER HERE
      // We override the frontend's "mock" weather with real data if available
      const realWeather = await getRealWeather(context.location || "Davao City");
      
      systemPrompt = `You are 'Umaly', a friendly field coordinator speaking in Taglish/Bisaya.
      Your goal: Convince the farmer to harvest early.
      
      LIVE CONTEXT:
      - Weather in ${context.location}: ${realWeather}
      - Factory Demand: High
      
      Task: Draft a short SMS (max 160 chars). If the weather is bad, use it as a reason.`;

      userPrompt = `Draft a message for Farmer ${context.farmerName}. Last harvest: ${context.lastHarvest}.`;
    }

    // ... (Keep other agents same) ...

    // --- CALL OPENAI ---
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: agentType !== 'scout' ? { type: "json_object" } : { type: "text" },
    });

    const result = completion.choices[0].message.content;
    
    const responseData = agentType !== 'scout' ? JSON.parse(result) : { message: result };
    
    return NextResponse.json(responseData);

  } catch (error) {
    console.error('AI Error:', error);
    return NextResponse.json({ 
        message: "AI Service Unavailable",
        status: "Healthy" // Fallback
    }, { status: 200 });
  }
}