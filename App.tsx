import React, { useState } from 'react';
import { LayoutDashboard, List, Plus, Layers, Menu } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { InventoryList } from './components/InventoryList';
import { InventoryForm } from './components/InventoryForm';
import { AIInsights } from './components/AIInsights';
import { INITIAL_INVENTORY } from './constants';
import { InventoryItem } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'ai'>('dashboard');
  const [items, setItems] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // CRUD Operations
  const handleAddItem = (newItem: Omit<InventoryItem, 'id' | 'lastUpdated'>) => {
    const item: InventoryItem = {
      ...newItem,
      id: Math.random().toString(36).substr(2, 9),
      lastUpdated: new Date().toISOString()
    };
    setItems(prev => [...prev, item]);
  };

  const handleUpdateItem = (updatedItemData: Omit<InventoryItem, 'id' | 'lastUpdated'>) => {
    if (!editingItem) return;
    const updatedItem: InventoryItem = {
      ...editingItem,
      ...updatedItemData,
      lastUpdated: new Date().toISOString()
    };
    setItems(prev => prev.map(item => item.id === editingItem.id ? updatedItem : item));
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const openEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (data: Omit<InventoryItem, 'id' | 'lastUpdated'>) => {
    if (editingItem) {
      handleUpdateItem(data);
    } else {
      handleAddItem(data);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // Navigation Logic
  const NavItem = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setMobileMenuOpen(false);
      }}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
        activeTab === id 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
          : 'text-slate-500 hover:bg-slate-100'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 flex justify-between items-center shadow-sm sticky top-0 z-20">
        <div className="flex items-center space-x-2">
            <Layers className="text-blue-600" size={24} />
            <span className="font-bold text-slate-800 text-lg">Inventario Pro AI</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600">
            <Menu size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out md:relative md:transform-none
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-slate-100 hidden md:flex items-center space-x-2">
          <div className="bg-blue-600 p-2 rounded-lg">
             <Layers className="text-white" size={20} />
          </div>
          <span className="font-bold text-slate-800 text-xl tracking-tight">Inventario Pro</span>
        </div>

        <nav className="p-4 space-y-2 mt-4 md:mt-0">
          <NavItem id="dashboard" label="Dashboard" icon={LayoutDashboard} />
          <NavItem id="inventory" label="Inventario" icon={List} />
          <NavItem id="ai" label="Análisis AI" icon={Layers} />
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-slate-100">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">JD</div>
                <div>
                    <p className="text-sm font-semibold text-slate-800">John Doe</p>
                    <p className="text-xs text-slate-500">Admin</p>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto space-y-6">
          
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">
                {activeTab === 'dashboard' && 'Panel de Control'}
                {activeTab === 'inventory' && 'Gestión de Productos'}
                {activeTab === 'ai' && 'Inteligencia Artificial'}
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                {activeTab === 'dashboard' && 'Resumen general de tu negocio en tiempo real.'}
                {activeTab === 'inventory' && 'Administra, edita y organiza tus existencias.'}
                {activeTab === 'ai' && 'Obtén insights valiosos impulsados por Gemini.'}
                </p>
            </div>
            
            {activeTab === 'inventory' && (
                <button
                onClick={() => {
                    setEditingItem(null);
                    setIsModalOpen(true);
                }}
                className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md shadow-blue-200 flex items-center space-x-2 transition-all active:scale-95"
                >
                <Plus size={20} />
                <span>Nuevo Producto</span>
                </button>
            )}
          </header>

          <div className="min-h-[500px]">
            {activeTab === 'dashboard' && <Dashboard items={items} />}
            {activeTab === 'inventory' && (
                <InventoryList 
                    items={items} 
                    onEdit={openEditModal} 
                    onDelete={handleDeleteItem} 
                />
            )}
            {activeTab === 'ai' && <AIInsights items={items} />}
          </div>

        </div>
      </main>

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div 
            className="fixed inset-0 bg-black/20 z-20 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Modal */}
      <InventoryForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        initialData={editingItem}
      />

    </div>
  );
}

export default App;