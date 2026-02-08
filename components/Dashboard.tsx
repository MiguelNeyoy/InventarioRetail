import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { InventoryItem } from '../types';
import { DollarSign, Package, AlertTriangle, TrendingUp } from 'lucide-react';

interface DashboardProps {
  items: InventoryItem[];
}

const COLORS = ['#0ea5e9', '#22c55e', '#eab308', '#f97316', '#ef4444', '#8b5cf6'];

export const Dashboard: React.FC<DashboardProps> = ({ items }) => {
  
  const stats = useMemo(() => {
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    const totalValue = items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    const lowStockCount = items.filter(item => item.quantity <= item.minStock).length;
    const topCategory = items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const sortedCats = Object.entries(topCategory).sort((a, b) => b[1] - a[1]);
    
    return { totalItems, totalValue, lowStockCount, topCategoryName: sortedCats[0]?.[0] || 'N/A' };
  }, [items]);

  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    items.forEach(item => {
      data[item.category] = (data[item.category] || 0) + item.quantity;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [items]);

  const valueData = useMemo(() => {
    // Top 5 items by total value
    return [...items]
      .sort((a, b) => (b.price * b.quantity) - (a.price * a.quantity))
      .slice(0, 5)
      .map(item => ({
        name: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name,
        value: item.price * item.quantity
      }));
  }, [items]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Productos</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.totalItems}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Valor Inventario</p>
            <h3 className="text-2xl font-bold text-slate-800">${stats.totalValue.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Stock Bajo</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.lowStockCount}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Categoría Top</p>
            <h3 className="text-lg font-bold text-slate-800 truncate">{stats.topCategoryName}</h3>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-[400px]">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Distribución por Categoría</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-[400px]">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Top 5 Productos por Valor Total</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={valueData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tickFormatter={(value) => `$${value}`} />
              <YAxis dataKey="name" type="category" width={100} style={{ fontSize: '12px' }} />
              <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
              <Bar dataKey="value" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};