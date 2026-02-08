import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { Edit2, Trash2, AlertCircle, Search } from 'lucide-react';

interface InventoryListProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
}

export const InventoryList: React.FC<InventoryListProps> = ({ items, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-full animate-fade-in">
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-slate-800">Listado de Productos</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64 bg-white"
          />
        </div>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4">Producto</th>
              <th className="px-6 py-4">Categoría</th>
              <th className="px-6 py-4 text-center">Stock</th>
              <th className="px-6 py-4 text-right">Precio</th>
              <th className="px-6 py-4 text-right">Valor Total</th>
              <th className="px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  No se encontraron productos
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <div className="flex flex-col">
                        <span>{item.name}</span>
                        <span className="text-xs text-slate-400 font-normal truncate max-w-[200px]">{item.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <span className={`${item.quantity <= item.minStock ? 'text-red-600 font-bold' : ''}`}>
                        {item.quantity}
                      </span>
                      {item.quantity <= item.minStock && (
                        <div className="relative group/tooltip">
                            <AlertCircle size={16} className="text-red-500" />
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 whitespace-nowrap">
                                Stock Bajo (Mín: {item.minStock})
                            </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">${item.price.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right font-medium text-slate-800">
                    ${(item.price * item.quantity).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-md transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-1.5 hover:bg-red-50 text-red-600 rounded-md transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};