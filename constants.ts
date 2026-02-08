import { InventoryItem, Category } from './types';

export const CATEGORIES: Category[] = ['Electrónica', 'Ropa', 'Hogar', 'Alimentos', 'Otros'];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: '1',
    name: 'Laptop Gamer X1',
    category: 'Electrónica',
    quantity: 12,
    price: 1200,
    minStock: 5,
    lastUpdated: new Date().toISOString(),
    description: 'Laptop de alto rendimiento para juegos.'
  },
  {
    id: '2',
    name: 'Camiseta Algodón Básica',
    category: 'Ropa',
    quantity: 150,
    price: 15,
    minStock: 20,
    lastUpdated: new Date().toISOString(),
    description: 'Camiseta 100% algodón, varios colores.'
  },
  {
    id: '3',
    name: 'Cafetera Automática',
    category: 'Hogar',
    quantity: 8,
    price: 85,
    minStock: 10,
    lastUpdated: new Date().toISOString(),
    description: 'Prepara café en segundos.'
  },
  {
    id: '4',
    name: 'Auriculares Bluetooth',
    category: 'Electrónica',
    quantity: 45,
    price: 50,
    minStock: 15,
    lastUpdated: new Date().toISOString(),
    description: 'Cancelación de ruido activa.'
  },
  {
    id: '5',
    name: 'Silla de Oficina Ergonómica',
    category: 'Hogar',
    quantity: 3,
    price: 250,
    minStock: 5,
    lastUpdated: new Date().toISOString(),
    description: 'Soporte lumbar ajustable.'
  }
];