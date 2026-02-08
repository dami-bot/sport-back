import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const navigate = useNavigate();
  const API_URL = 'https://698656806964f10bf25615c9.mockapi.io/productos/productos';

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editandoId, setEditandoId] = useState(null); // Para saber si estamos editando
  const [form, setForm] = useState({ nombre: '', price: '', categoria: 'Running', stock: "", imageUrl: '' });

  // Cargar productos al entrar
  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setProductos(data);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar productos", error);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const metodo = editandoId ? 'PUT' : 'POST';
    const url = editandoId ? `${API_URL}/${editandoId}` : API_URL;

    // Creamos el objeto EXACTO que MockAPI espera según el Schema
    const productoParaEnviar = {
      name: form.nombre,      // El 'nombre' de tu input va al 'name' de la API
      price: Number(form.price),
      category: form.categoria, // La 'categoria' de tu select va a 'category'
      stock: Number(form.stock),
      imageUrl: form.imageUrl
    };

    try {
      const res = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoParaEnviar)
      });

      if (res.ok) {
        alert(editandoId ? "¡Actualizado con éxito!" : "¡Producto creado! 🚀");
        setForm({ nombre: '', price: '', categoria: 'Running', stock: 10, imageUrl: '' });
        setEditandoId(null);
        fetchProductos(); // Recargamos la lista
      }
    } catch (error) {
      console.error("Error al conectar con la nube:", error);
    }
  };

  const eliminarProducto = async (id) => {
    if (window.confirm("¿Seguro que querés borrar este producto?")) {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchProductos();
    }
  };

  const prepararEdicion = (p) => {
    setEditandoId(p.id);

    setForm({
      // Mapeamos 'name' de la API a 'nombre' de tu estado
      nombre: p.name || '',
      price: p.price || '',
      categoria: p.category || 'Running', // En la consola dice 'category'
      stock: p.stock || '',
      imageUrl: p.imageUrl || ''
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="bg-zinc-900 p-8 rounded-[2rem] border border-orange-600/20 shadow-2xl space-y-4">
          <h2 className="text-3xl font-black italic text-orange-600 uppercase mb-6 text-center">
            {editandoId ? 'Editando Producto' : 'Panel de Control'}
          </h2>

          <input name="nombre" value={form.nombre} placeholder="Nombre" className="w-full bg-black p-4 rounded-xl border border-white/10 outline-none focus:border-orange-600" onChange={handleChange} required />

          <div className="grid grid-cols-2 gap-4">
            <input name="price" type="number" value={form.price} placeholder="Precio" className="bg-black p-4 rounded-xl border border-white/10 outline-none focus:border-orange-600" onChange={handleChange} required />
            <input name="stock" type="number" value={form.stock} placeholder="Stock" className="bg-black p-4 rounded-xl border border-white/10 outline-none focus:border-orange-600" onChange={handleChange} required />
          </div>

          <input name="imageUrl" value={form.imageUrl} placeholder="URL de imagen" className="w-full bg-black p-4 rounded-xl border border-white/10 outline-none focus:border-orange-600" onChange={handleChange} />
          {/* CATEGORÍA */}
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 uppercase font-bold ml-2 tracking-widest">
              Categoría del Producto
            </label>
            <select
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              className="w-full bg-black p-4 rounded-xl border border-white/10 outline-none focus:border-orange-600 text-white appearance-none cursor-pointer"
            >
              <option value="Running">🏃‍♂️ Running</option>
              <option value="Fútbol">⚽ Fútbol</option>
              <option value="Entrenamiento">🏋️‍♂️ Entrenamiento</option>
              <option value="Calzado">👟 Calzado</option>
              <option value="Accesorios">🎒 Accesorios</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 bg-orange-600 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
              {editandoId ? 'Guardar Cambios' : 'Lanzar Producto'}
            </button>
            {editandoId && (
              <button type="button" onClick={() => { setEditandoId(null); setForm({ nombre: '', price: '', categoria: 'Running', stock: 10, imageUrl: '' }) }} className="bg-zinc-700 px-6 rounded-xl font-bold uppercase">Cancelar</button>
            )}
          </div>
        </form>

        {/* LISTA DE GESTIÓN */}
        <div className="divide-y divide-white/5">
          {loading ? (
            <p className="p-10 text-center text-gray-500 italic">Cargando stock...</p>
          ) : (
            productos.map((p, index) => {
              // GENERAMOS UNA KEY ÚNICA REAL: Si no hay p.id, usamos el index
              const itemKey = p.id ? String(p.id) : `prod-${index}`;

              return (
                <div key={itemKey} className="p-4 flex justify-between items-center hover:bg-white/5 transition-colors">
                  <div className="flex gap-4 items-center">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} className="w-14 h-14 rounded-xl object-cover bg-black border border-white/10" alt="" />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-zinc-800 flex items-center justify-center text-[10px] text-gray-500 text-center px-1">Sin foto</div>
                    )}

                    <div>
                      {/* Aquí usamos los nombres EXACTOS que vimos en tu consola */}
                      <p className="font-bold uppercase text-sm text-white">
                        {p.name || p.nombre || 'Producto sin nombre'}
                      </p>
                      <p className="text-orange-500 text-xs font-black">
                        ${Number(p.price || 0).toLocaleString()}
                        <span className="text-gray-600 font-medium ml-2 uppercase text-[10px]">
                          | Stock: {p.stock || 0} | {p.category || p.categoria || 'S/C'}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => prepararEdicion(p)}
                      className="bg-blue-600/10 text-blue-400 px-4 py-2 rounded-lg text-[10px] font-black hover:bg-blue-600 hover:text-white transition-all uppercase"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarProducto(p.id)}
                      className="bg-red-600/10 text-red-400 px-4 py-2 rounded-lg text-[10px] font-black hover:bg-red-600 hover:text-white transition-all uppercase"
                    >
                      Borrar
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <button onClick={() => navigate('/')} className="w-full text-gray-500 uppercase text-xs font-bold tracking-[0.3em] py-10 hover:text-white transition-colors">← Volver a la Tienda</button>
      </div>
    </div>
  );
}