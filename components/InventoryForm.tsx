import React, { useState, useEffect } from 'react';
import { InventoryItem, Category } from '../types';
import { CATEGORIES } from '../constants';
import { X, Save } from 'lucide-react';

interface InventoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => void;
  initialData?: InventoryItem | null;
}

export const InventoryForm: React.FC<InventoryFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: CATEGORIES[0] as string,
    quantity: 0,
    price: 0,
    minStock: 5,
    description: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        category: initialData.category,
        quantity: initialData.quantity,
        price: initialData.price,
        minStock: initialData.minStock,
        description: initialData.description || ''
      });
    } else {
      setFormData({
        name: '',
        category: CATEGORIES[0],
        quantity: 0,
        price: 0,
        minStock: 5,
        description: ''
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      category: formData.category,
      quantity: Number(formData.quantity),
      price: Number(formData.price),
      minStock: Number(formData.minStock),
      description: formData.description
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 m-4 animate-scale-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">
            {initialData ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
              placeholder="Ej. Laptop X1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Cantidad</label>
               <input
                required
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Precio ($)</label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              />
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Stock Mínimo</label>
               <input
                required
                type="number"
                min="0"
                value={formData.minStock}
                onChange={(e) => setFormData({...formData, minStock: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descripción (Opcional)</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-white"
              placeholder="Detalles adicionales..."
            />
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center space-x-2 transition-colors shadow-sm shadow-blue-200"
            >
              <Save size={18} />
              <span>Guardar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};