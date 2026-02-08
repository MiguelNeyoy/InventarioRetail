export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  minStock: number;
  description?: string;
  lastUpdated: string;
}

export type Category = 'Electrónica' | 'Ropa' | 'Hogar' | 'Alimentos' | 'Otros';

export interface AIAnalysisResult {
  summary: string;
  alerts: string[];
  opportunity: string;
}

export interface ChartData {
  name: string;
  value: number;
}