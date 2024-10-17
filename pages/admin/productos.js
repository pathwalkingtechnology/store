import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria_id: ''
  });

  useEffect(() => {
    // Cargar productos desde Supabase
    const fetchProductos = async () => {
      let { data, error } = await supabase.from('productos').select('*');
      if (error) console.error('Error fetching productos:', error);
      else setProductos(data);
    };
    fetchProductos();
  }, []);

  const handleInputChange = (e) => {
    setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value });
  };

  const agregarProducto = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('productos').insert([nuevoProducto]);
    if (error) console.error('Error insertando producto:', error);
    else setProductos([...productos, data[0]]);
  };

  return (
    <div>
      <h1>Gestionar Productos</h1>
      <form onSubmit={agregarProducto}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del producto"
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="descripcion"
          placeholder="Descripción"
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          step="0.01"
          name="precio"
          placeholder="Precio"
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="categoria_id"
          placeholder="ID de la categoría"
          onChange={handleInputChange}
          required
        />
        <button type="submit">Agregar Producto</button>
      </form>
      
      <ul>
        {productos.map((producto) => (
          <li key={producto.id}>
            {producto.nombre} - ${producto.precio} (ID categoría: {producto.categoria_id})
          </li>
        ))}
      </ul>
    </div>
  );
}
