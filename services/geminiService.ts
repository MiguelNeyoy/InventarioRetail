import { GoogleGenAI, Type } from "@google/genai";
import { InventoryItem, AIAnalysisResult } from "../types";

// Initialize the Gemini AI client
// NOTE: import.meta.env.VITE_GEMINI_API_KEY is assumed to be available in the environment.
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

export const analyzeInventoryWithGemini = async (items: InventoryItem[]): Promise<AIAnalysisResult> => {
  try {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      throw new Error("API Key no encontrada");
    }

    const inventorySummary = items.map(item => 
      `- ${item.name} (${item.category}): ${item.quantity} unidades, $${item.price} c/u. Stock Mínimo: ${item.minStock}`
    ).join('\n');

    const prompt = `
      Actúa como un experto en gestión de inventarios. Analiza la siguiente lista de productos y genera un reporte útil.
      
      Lista de Inventario:
      ${inventorySummary}
      
      Proporciona:
      1. Un resumen general del estado del inventario.
      2. Una lista de alertas críticas (stock bajo, exceso de stock, valor inmovilizado).
      3. Una oportunidad de mejora o estrategia de venta.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "Resumen general de 2-3 frases." },
            alerts: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Lista de 2-4 alertas importantes."
            },
            opportunity: { type: Type.STRING, description: "Una sugerencia estratégica accionable." }
          },
          required: ["summary", "alerts", "opportunity"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No se recibió respuesta de Gemini.");
    }

    return JSON.parse(resultText) as AIAnalysisResult;

  } catch (error) {
    console.error("Error analizando inventario con Gemini:", error);
    return {
      summary: "No se pudo conectar con el asistente inteligente. Verifique su conexión o clave API.",
      alerts: ["Error de conexión AI"],
      opportunity: "Intente nuevamente más tarde."
    };
  }
};