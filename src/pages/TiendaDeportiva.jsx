import { useState, useEffect,useRef } from 'react';
import NavbarSports from '../components/sports-shop/NavbarSports';
import HeroSports from '../components/sports-shop/HeroSports';
import CategoryGrid from '../components/sports-shop/CategoryGrid';
import Features from '../components/sports-shop/Features';
import CustomOrders from '../components/sports-shop/CustomOrders';
import SportsProductCard from '../components/sports-shop/SportsProductCard';

export default function TiendaDeportiva() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const productosRef = useRef(null); // Creamos la referencia

  const irAProductos = () => {
    productosRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  // AGREGAMOS ESTADO PARA CATEGORÍA
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');

  const API_URL = 'https://698656806964f10bf25615c9.mockapi.io/productos/productos';
  const categorias = ['Todas', 'Running', 'Fútbol', 'Entrenamiento', 'Calzado', 'Accesorios'];

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      const adaptados = data.map(p => ({
        id: p.id,
        nombre: p.name || p.nombre, // Soporta ambos por seguridad
        precio: Number(p.price || p.precio),
        categoria: p.category || p.categoria,
        imagen: p.imageUrl || p.imagen || "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        stock: p.stock
      }));
      setProductos(adaptados);
      setLoading(false);
    } catch (error) {
      console.error("Error cargando productos:", error);
    }
  };

  const agregarAlCarrito = (prod) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.id === prod.id);
      if (existe) {
        return prev.map(item =>
          item.id === prod.id ? { ...item, cantidad: (item.cantidad || 1) + 1 } : item
        );
      }
      return [...prev, { ...prod, cantidad: 1 }];
    });
  };

  const restarCantidad = (id) => {
    setCarrito(prev => prev.map(item =>
      item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
    ).filter(item => item.cantidad > 0));
  };

  const getIconoCategoria = (cat) => {
    const categoria = cat?.toLowerCase() || '';
    if (categoria.includes('run')) return '🏃‍♂️';
    if (categoria.includes('fit') || categoria.includes('train')) return '🏋️‍♀️';
    if (categoria.includes('foot') || categoria.includes('calc')) return '⚽';
    if (categoria.includes('gym')) return '💪';
    return '📦';
  };

  // --- LÓGICA DE FILTRADO CORREGIDA ---
  const productosFiltrados = productos.filter(p => {
    const coincideTexto = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
                          p.categoria.toLowerCase().includes(busqueda.toLowerCase());
    const coincideBoton = categoriaActiva === 'Todas' || p.categoria === categoriaActiva;
    
    return coincideTexto && coincideBoton;
  });

  const finalizarCompraMaestra = async () => {
    if (carrito.length === 0) return;

    const numeroTelefono = "5491121676940";
    const mensajeBase = "*NUEVO PEDIDO - SPORT-BACK* 🚀\n\n";
    // Corregido para mostrar cantidad y precio subtotal
    const listaProductos = carrito.map(p => `• ${p.nombre} (x${p.cantidad}) - $${(p.precio * p.cantidad).toLocaleString()}`).join('\n');
    const totalPedido = carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);

    const mensajeFinal = encodeURIComponent(
      `${mensajeBase}${listaProductos}\n\n*TOTAL A PAGAR: $${totalPedido.toLocaleString()}*\n\n_Por favor, confírmame el stock para coordinar el pago._`
    );
    const urlWhatsApp = `https://wa.me/${numeroTelefono}?text=${mensajeFinal}`;

    try {
      await Promise.all(
        carrito.map(async (item) => {
          const nuevoStock = Math.max(0, item.stock - item.cantidad);
          return fetch(`${API_URL}/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stock: nuevoStock })
          });
        })
      );

      window.open(urlWhatsApp, '_blank');
      setCarrito([]);
      setMostrarCarrito(false);
      cargarProductos();
    } catch (error) {
      window.open(urlWhatsApp, '_blank');
    }
  };

  return (
    <div className="bg-black min-h-screen pt-16">
      <NavbarSports
        cartCount={carrito.reduce((total, item) => total + (item.cantidad || 0), 0)}
        onOpenCart={() => setMostrarCarrito(true)}
      />
      <HeroSports onVerColeccion={irAProductos}/>
      <CategoryGrid />

      {/* BARRA DE BÚSQUEDA */}
      <div ref={productosRef} className="max-w-7xl mx-auto px-6 mb-6 scroll-mt-24">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">🔍</div>
          <input
            type="text"
            placeholder="BUSCAR PRODUCTOS..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-zinc-900/50 border border-white/10 text-white py-5 pl-12 pr-6 rounded-2xl outline-none focus:border-orange-600 transition-all font-bold uppercase tracking-widest text-sm"
          />
        </div>
      </div>

      {/* BOTONES DE CATEGORÍA */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex flex-wrap gap-3">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaActiva(cat)}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                categoriaActiva === cat
                  ? 'bg-orange-600 border-orange-600 text-black shadow-[0_0_20px_rgba(234,88,12,0.4)]'
                  : 'bg-zinc-900 border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <p className="mt-4 text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] ml-2">
          Resultados: <span className="text-orange-600">{productosFiltrados.length}</span>
        </p>
      </div>

      {/* SECCIÓN DE PRODUCTOS */}
      <section className="py-20 bg-stone-950 px-4 min-h-[600px]">
        <div className="container mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 uppercase tracking-widest text-xs">Cargando...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productosFiltrados.map((prod, index) => (
                <SportsProductCard
                  key={prod.id || index}
                  producto={prod}
                  onAdd={() => agregarAlCarrito(prod)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* MODAL DEL CARRITO (Manteniendo tu estilo visual) */}
      {mostrarCarrito && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMostrarCarrito(false)} />
          <div className="relative w-full max-w-md bg-zinc-950 h-full p-8 border-l border-orange-600/30 flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black italic text-orange-600 uppercase">Mi Pedido</h2>
              <button onClick={() => setMostrarCarrito(false)} className="text-gray-500 hover:text-white">Cerrar ✕</button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {carrito.map((item, i) => (
                <div key={item.id || i} className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getIconoCategoria(item.categoria)}</span>
                      <div>
                        <h4 className="text-white font-bold uppercase text-[11px]">{item.nombre}</h4>
                        <p className="text-gray-500 text-[10px] uppercase">{item.categoria}</p>
                      </div>
                    </div>
                    <span className="text-orange-500 font-black">${(item.precio * item.cantidad).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 bg-black/50 px-3 py-1.5 rounded-full border border-white/10">
                      <button onClick={() => restarCantidad(item.id)} className="text-orange-600 font-bold w-6">—</button>
                      <span className="text-white font-black text-xs">{item.cantidad}</span>
                      <button onClick={() => agregarAlCarrito(item)} className="text-orange-600 font-bold w-6">+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {carrito.length > 0 && (
              <div className="pt-8 mt-4 border-t border-white/10">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-gray-500 uppercase text-[10px]">Total</span>
                  <span className="text-4xl font-black text-white italic">
                    ${carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0).toLocaleString()}
                  </span>
                </div>
                <button onClick={finalizarCompraMaestra} className="w-full bg-orange-600 text-black font-extrabold py-5 rounded-2xl uppercase tracking-[0.2em] hover:bg-white transition-all">
                  Confirmar Pedido 🚀
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Features />
      <CustomOrders />
      <footer className="py-10 text-center text-gray-600 text-xs border-t border-white/5">
        &copy; 2026 DamiWeb.jsx - CONECTADO A MOCKAPI CLOUD
      </footer>
    </div>
  );
}