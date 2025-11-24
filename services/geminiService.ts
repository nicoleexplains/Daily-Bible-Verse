import { GoogleGenAI, Type, Modality } from "@google/genai";
import { VerseData } from "../types";

// Helper to decode Base64 string
const decode = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

// Helper to decode audio data
const decodeAudioData = async (
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
};

let aiClient: GoogleGenAI | null = null;

const getClient = (): GoogleGenAI => {
  if (!aiClient) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        // Fallback for demo purposes if environment variable is missing in some environments, 
        // though strictly the prompt says assume process.env.API_KEY is valid.
        console.error("API_KEY is missing");
    }
    aiClient = new GoogleGenAI({ apiKey: apiKey || '' });
  }
  return aiClient;
};

export const fetchVerseByTheme = async (theme: string): Promise<VerseData> => {
  const ai = getClient();
  
  const prompt = `Generate a bible verse relevant to the theme: "${theme}". 
  If the theme is 'Daily Inspiration', choose a generally uplifting and well-known verse.
  Include a short, 2-sentence reflection or prayer based on the verse.
  Return JSON.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          scripture: { type: Type.STRING, description: "The bible verse text." },
          reference: { type: Type.STRING, description: "Book, chapter, and verse reference (e.g., John 3:16)." },
          reflection: { type: Type.STRING, description: "A short, encouraging reflection or prayer." }
        },
        required: ["scripture", "reference", "reflection"]
      }
    }
  });

  const text = response.text;
  if (!text) {
      throw new Error("No response from Gemini");
  }
  return JSON.parse(text) as VerseData;
};

export const fetchSpeechForText = async (text: string): Promise<AudioBuffer> => {
  const ai = getClient();
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Puck' }, // Gentle, calm voice
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  
  if (!base64Audio) {
    throw new Error("No audio data returned");
  }

  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  const audioBytes = decode(base64Audio);
  
  return await decodeAudioData(audioBytes, audioContext, 24000, 1);
};