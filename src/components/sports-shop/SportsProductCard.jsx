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
      <div className="relative group overflow-hidden rounded-2xl bg-zinc-900 border border-white/5">
        {/* Contenedor de imagen */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* OVERLAY DEL BOTÓN: 
        En celu: Siempre visible abajo o aparece con un degradado sutil.
        En compu: Aparece solo al pasar el mouse.
    */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent 
                    opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300
                    flex items-end p-4">

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAdd(producto);
              }}
              className="w-full bg-orange-600 text-black font-black py-4 rounded-xl 
                   uppercase text-[10px] tracking-[0.2em] shadow-2xl
                   active:scale-95 touch-manipulation"
            >
              Añadir al Carrito +
            </button>
          </div>
        </div>

        {/* Info del producto abajo (Siempre visible) */}
        <div className="p-4">
          <h3 className="text-white font-bold uppercase text-xs truncate">{producto.nombre}</h3>
          <p className="text-orange-500 font-black mt-1">${producto.precio.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}