import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState({ nombre: '', descripcion: '' });

  useEffect(() => {
    const fetchCategorias = async () => {
      let { data, error } = await supabase.from('categorias').select('*');
      if (error) console.error('Error fetching categorias:', error);
      else setCategorias(data);
    };
    fetchCategorias();
  }, []);

  const handleInputChange = (e) => {
    setNuevaCategoria({ ...nuevaCategoria, [e.target.name]: e.target.value });
  };

  const agregarCategoria = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('categorias').insert([nuevaCategoria]);
    if (error) console.error('Error insertando categoría:', error);
    else setCategorias([...categorias, data[0]]);
  };

  return (
    <div>
      <h1>Gestionar Categorías</h1>
      <form onSubmit={agregarCategoria}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre de la categoría"
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="descripcion"
          placeholder="Descripción"
          onChange={handleInputChange}
        />
        <button type="submit">Agregar Categoría</button>
      </form>
      
      <ul>
        {categorias.map((categoria) => (
          <li key={categoria.id}>
            {categoria.nombre} - {categoria.descripcion}
          </li>
        ))}
      </ul>
    </div>
  );
}
