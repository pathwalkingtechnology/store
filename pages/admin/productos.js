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
  const [imagen, setImagen] = useState(null);

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

  const handleImageChange = (e) => {
    setImagen(e.target.files[0]);
  };

  const agregarProducto = async (e) => {
    e.preventDefault();

    // Crear un formData para enviar la imagen al servidor
    const formData = new FormData();
    formData.append('imagen', imagen);

    // Subir la imagen primero
    const imageResponse = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const imageData = await imageResponse.json();

    if (imageResponse.ok) {
      const productoConImagen = {
        ...nuevoProducto,
        imagen: imageData.fileName // Almacenar solo el nombre de la imagen
      };

      // Insertar el producto con el nombre de la imagen en la base de datos
      const { data, error } = await supabase.from('productos').insert([productoConImagen]);
      if (error) console.error('Error insertando producto:', error);
      else setProductos([...productos, data[0]]);
    } else {
      console.error('Error subiendo la imagen:', imageData.error);
    }
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
        <input
          type="file"
          name="imagen"
          onChange={handleImageChange}
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
