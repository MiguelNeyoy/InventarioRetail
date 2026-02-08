import React, { useState } from 'react';
import { InventoryItem, AIAnalysisResult } from '../types';
import { analyzeInventoryWithGemini } from '../services/geminiService';
import { Sparkles, Loader2, Lightbulb, AlertTriangle, TrendingUp } from 'lucide-react';

interface AIInsightsProps {
  items: InventoryItem[];
}

export const AIInsights: React.FC<AIInsightsProps> = ({ items }) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await analyzeInventoryWithGemini(items);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200">
            <Sparkles className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Asistente Inteligente Gemini</h3>
            <p className="text-sm text-slate-500">Optimiza tu stock con IA</p>
          </div>
        </div>
        
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="px-4 py-2 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium rounded-lg flex items-center space-x-2 transition-all shadow-sm disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Analizando...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>Generar Análisis</span>
            </>
          )}
        </button>
      </div>

      {analysis && (
        <div className="space-y-4 animate-slide-up">
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-indigo-100">
             <div className="flex items-start space-x-3">
                <Lightbulb className="text-amber-500 mt-1 flex-shrink-0" size={20} />
                <div>
                    <h4 className="font-semibold text-slate-800 text-sm mb-1">Resumen Ejecutivo</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{analysis.summary}</p>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-red-100">
                <div className="flex items-center space-x-2 mb-3">
                    <AlertTriangle className="text-red-500" size={18} />
                    <h4 className="font-semibold text-slate-800 text-sm">Alertas Críticas</h4>
                </div>
                <ul className="space-y-2">
                    {analysis.alerts.map((alert, idx) => (
                        <li key={idx} className="text-xs text-slate-600 flex items-start">
                            <span className="mr-2 text-red-400">•</span>
                            {alert}
                        </li>
                    ))}
                </ul>
             </div>

             <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-emerald-100">
                <div className="flex items-center space-x-2 mb-3">
                    <TrendingUp className="text-emerald-500" size={18} />
                    <h4 className="font-semibold text-slate-800 text-sm">Oportunidad Detectada</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                    {analysis.opportunity}
                </p>
             </div>
          </div>
        </div>
      )}
      
      {!analysis && !loading && (
        <div className="text-center py-8 text-slate-400 text-sm">
          Presiona "Generar Análisis" para obtener recomendaciones sobre tu inventario actual.
        </div>
      )}
    </div>
  );
};