import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with custom User-Agent as instructed
const geminiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (geminiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} else {
  console.warn("WARNING: GEMINI_API_KEY is not defined in the environment. AI-driven features will run in offline/simulation mode.");
}

// ----------------------------------------------------
// API ENDPOINTS
// ----------------------------------------------------

// 1. Optimize Prompt Endpoint
app.post('/api/optimize-prompt', async (req, res) => {
  const { prompt, contentType, categoryBias } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Please provide a valid raw prompt string.' });
  }

  if (!ai) {
    return res.status(200).json({
      originalPrompt: prompt,
      optimizedImagePrompt: `${prompt}, gorgeous 85mm portrait composition, cinematic Rembrandt side-lighting, f/1.4 rich bokeh, cinematic color grading, Kodak film stock texture`,
      optimizedVideoPrompt: `Camera pans slowly around the subject: ${prompt}. Smooth Steadicam tracking, golden hour rim lighting framing the outline, cinematic volumetric haze, 4k ultra resolution`,
      pacingBreakdown: "Offline Simulation Mode: GEMINI_API_KEY is missing. Providing pre-optimized cinematic template.",
      addedVocabulary: [
        { term: "85mm Portrait Prime", benefit: "Isolates the subject and compresses facial features naturally.", category: "lenses" },
        { term: "Rembrandt Lighting", benefit: "Creates dramatic classic painterly shadows and high-contrast facial dimension.", category: "lighting" }
      ],
      sceneAtmosphere: "Dramatic, rich, high-end theatrical presence with deep emotional weight.",
      cinematicAnalogy: "Evokes the visual styling of Roger Deakins' work in modern cinema."
    });
  }

  try {
    const promptString = `
      You are an elite Director of Photography (DP) and a master AI Prompt Engineer for tools like Midjourney, DALL-E 3, Stable Diffusion, Sora, and Veo.
      Your task is to analyze the user's raw idea: "${prompt}" and supercharge it using professional photography and cinematography vocabulary.
      
      Requirements for your expansion:
      - Lens Selection: Choose a specific, technically appropriate lens (e.g., 85mm prime, 14mm ultra-wide, anamorphic lens) that fits the physical mood of the prompt.
      - Lighting Setup: Specify a high-end lighting setup (e.g., low-key chiaroscuro, Rembrandt studio light, volumetric rims, high-key diffused).
      - Camera Angle & Framing: Define the appropriate shot scale (e.g., cowboy shot, medium close-up, extreme wide macro) and angle.
      - Color Grade & Medium: Suggest high-end cinematic coloration or realistic film stocks (e.g., CineStill 800T, vintage Kodachrome, Teal & Orange blockbuster grade).
      - Motion Directions (Specifically for the Video prompt): For video, detail exactly how the camera moves (e.g., dynamic pan, dolly reveal, smooth steadicam tracking) and include details on lighting shifts, atmosphere, and pacing.

      Format the response strictly using the following JSON schema:
      - originalPrompt (string): the exact original text.
      - optimizedImagePrompt (string): a beautifully crafted, highly descriptive, single-paragraph image prompt using professional photography terms. Make it rich, elegant, and ready to paste into Midjourney/DALL-E. No commentary inside this field, just the prompt itself.
      - optimizedVideoPrompt (string): a video prompt optimized for Sora, Gen-3, or Veo, describing the scene action, the exact cinematic camera movement, ambient changes, speed, and atmospheric effects.
      - pacingBreakdown (string): 1-2 sentence instruction on how the camera and subject transitions should flow.
      - addedVocabulary (array of objects): listing 2 to 4 advanced cinematography terms you introduced. Each object must have:
          - term (string)
          - benefit (string) (how exactly this term improves the rendered visual)
          - category (string) (e.g., "lenses", "lighting", "angles", "color-film")
      - sceneAtmosphere (string): A short description of the overall aesthetic mood.
      - cinematicAnalogy (string): A reference film or director that shares this visual language (e.g., "Reminiscent of Roger Deakins' cinematography in Blade Runner 2049").
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: promptString,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            originalPrompt: { type: Type.STRING },
            optimizedImagePrompt: { type: Type.STRING },
            optimizedVideoPrompt: { type: Type.STRING },
            pacingBreakdown: { type: Type.STRING },
            addedVocabulary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  benefit: { type: Type.STRING },
                  category: { type: Type.STRING }
                },
                required: ["term", "benefit", "category"]
              }
            },
            sceneAtmosphere: { type: Type.STRING },
            cinematicAnalogy: { type: Type.STRING }
          },
          required: ["originalPrompt", "optimizedImagePrompt", "optimizedVideoPrompt", "addedVocabulary", "sceneAtmosphere"]
        }
      }
    });

    const resultText = response.text || "{}";
    const resultJson = JSON.parse(resultText);
    res.json(resultJson);

  } catch (error: any) {
    console.error("Gemini optimization error: ", error);
    res.status(500).json({ error: "Failed to optimize prompt. Gemini API returned an error.", details: error.message });
  }
});

// 2. Grade Practice Prompt Endpoint
app.post('/api/grade-prompt', async (req, res) => {
  const { challengeTitle, challengeDesc, requiredElements, userPrompt } = req.body;

  if (!userPrompt || typeof userPrompt !== 'string') {
    return res.status(400).json({ error: 'Please provide your prompt answer for evaluation.' });
  }

  if (!ai) {
    // Return mock grading in offline mode
    const score = Math.floor(Math.random() * 20) + 75; // 75-95
    return res.json({
      score: score,
      grammarFeedback: "Offline Review: Solid start! Your raw description is evocative.",
      technicalMatch: requiredElements ? [requiredElements[0] || "cinematic lenses"] : ["cinematic lenses"],
      omissions: requiredElements ? requiredElements.slice(1) : ["extreme low-key atmosphere"],
      critique: "To elevate this shot, explicitly name your camera glass and lighting setup. Rather than describing 'it looks vintage', use terms like 'Kodachrome 64' or 'CineStill 800T' to bypass generic AI rendering biases.",
      suggestedPrompt: `${userPrompt}, shot on 35mm film, volumetric rim lighting, deep shadows, cinematic atmosphere, f/2.0 aperture`
    });
  }

  try {
    const promptString = `
      You are an prestigious Film School professor grading a student's cinematography and prompting exam.
      
      The task was: "${challengeTitle}"
      Task Description: "${challengeDesc}"
      Expected core elements to see: ${JSON.stringify(requiredElements || [])}

      The student's submitted prompt is: "${userPrompt}"

      Evaluate the student's prompt based on:
      1. Technical precision: Did they use specific focal lengths, lighting styles, camera setups or historic film systems?
      2. Expressive prose: Does it paint a vivid picture that an AI generator (or set crew) can translate?
      3. Omissions: Did they overlook the critical camera properties described in the objective?

      You must return a raw JSON response strictly conforming to the following fields:
      - score (integer, 0 to 100): Be fair, rewarding advanced photography words!
      - grammarFeedback (string): Short comment on the sentence structure of the prompt.
      - technicalMatch (array of strings): High-level photo terms they successfully included in their prompt text.
      - omissions (array of strings): Key photo terms or principles they should have included to meet the core objectives.
      - critique (string): 2-3 sentences of expert critique detailing how they can improve their cinema jargon.
      - suggestedPrompt (string): A corrected, exceptionally refined version of their prompt that models the ideal answer.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: promptString,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            grammarFeedback: { type: Type.STRING },
            technicalMatch: { type: Type.ARRAY, items: { type: Type.STRING } },
            omissions: { type: Type.ARRAY, items: { type: Type.STRING } },
            critique: { type: Type.STRING },
            suggestedPrompt: { type: Type.STRING }
          },
          required: ["score", "critique", "suggestedPrompt", "technicalMatch", "omissions"]
        }
      }
    });

    const resultText = response.text || "{}";
    const resultJson = JSON.parse(resultText);
    res.json(resultJson);

  } catch (error: any) {
    console.error("Gemini grading error: ", error);
    res.status(500).json({ error: "Failed to grade your prompt. Gemini API returned an error.", details: error.message });
  }
});

// ----------------------------------------------------
// DEV / PROD SERVER INTEGRATION
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Mount Vite in middleware mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CinePrompt Studio server running on HTTP host 0.0.0.0:${PORT}`);
  });
}

startServer();
