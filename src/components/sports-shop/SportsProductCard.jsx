import React, { useState } from 'react';

export default function SportsProductCard({ producto, onAdd }) {
  const [isHovered, setIsHovered] = useState(false);

  // --- MAPEO DE SEGURIDAD ---
  // Extraemos las propiedades con los nombres que MockAPI usa (name, category, price)
  // Pero también dejamos los otros por si acaso.
  const name = producto.name || producto.nombre || "Producto sin nombre";
  const category = producto.category || producto.categoria || "Deportes";
  const price = producto.price || producto.precio || 0;
  const image = producto.imageUrl || producto.imagen || 'https://via.placeholder.com/400';
  const stock = producto.stock || 0;

  return (
    <div
      className="group relative bg-stone-900 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge de Stock o Nuevo */}
      {(producto.isNew || stock < 5) && (
        <span className={`absolute top-4 left-4 z-20 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full ${stock < 5 ? 'bg-red-600' : 'bg-orange-600'}`}>
          {stock < 5 ? 'Últimos pares' : 'Nuevo'}
        </span>
      )}

      {/* Contenedor de Imagen */}
      <div className="relative h-80 overflow-hidden bg-stone-800">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
        />

        {/* Botón rápido de compra */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Evita que el toque se pierda
              onAdd();
            }}
            className="w-full bg-orange-600 text-black font-black py-3 rounded-xl 
             uppercase text-xs tracking-widest transition-all
             active:scale-95 z-30
             md:opacity-0 md:group-hover:opacity-100 
             opacity-100 mt-4 shadow-lg shadow-orange-600/20"
          >
            Añadir al carrito +
          </button>
        </div>
      </div>

      {/* Info del Producto */}
      <div className="p-5">
        <p className="text-orange-500 text-[10px] font-bold uppercase tracking-widest mb-1">
          {category}
        </p>
        <h3 className="text-white font-black italic uppercase tracking-tighter text-xl mb-2">
          {name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm font-medium">Stock: {stock}</span>
          <span className="text-white font-bold text-xl">
            ${Number(price).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}