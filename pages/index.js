import Image from "next/image";
import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero from '../components/Hero';

// Obtener productos desde la base de datos de Supabase
export async function getServerSideProps() {
  const { data: productos, error } = await supabase
    .from('productos')
    .select('*');

  if (error) {
    console.error(error);
    return { props: { productos: [] } };
  }

  return {
    props: { productos },
  };
}

export default function Home({ productos }) {
  // Estado para el carrito
  const [carrito, setCarrito] = useState([]);

  // Función para agregar un producto al carrito
  const agregarAlCarrito = (producto) => {
    const nuevoCarrito = [...carrito, producto];
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito)); // Persistencia del carrito
  };

  return (
    <div className="bg-[#f9f9f9]"> {/* Fondo general */}
      {/* Header */}
      <Header carritoCount={carrito.length} productos/>
         
      {/* Hero */}
      <Hero />
      
      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-[#013254] text-center"> {/* Azul primario */}
          Bienvenidos a Mao Store
        </h1>

        {/* Listado de productos */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {productos.map((producto) => (
            <li key={producto.id} className="border p-4 rounded-lg shadow-lg bg-white">
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="w-full h-48 object-cover mb-4 rounded-lg"
              />
              <h2 className="text-2xl font-semibold text-[#15557b]"> {/* Azul secundario */}
                {producto.nombre}
              </h2>
              <p className="text-gray-600 mb-2">{producto.descripcion}</p>
              <p className="text-lg font-bold text-[#FF5B31]">${producto.precio.toFixed(2)}</p> {/* Naranja */}
              <button
                onClick={() => agregarAlCarrito(producto)}
                className="mt-4 bg-[#013254] text-white px-4 py-2 rounded-lg hover:bg-[#15557b] transition-colors" {/* Botón con azul primario y hover */}
              >
                Agregar al carrito
              </button>
            </li>
          ))}
        </ul>

        {/* Enlace al carrito */}
        <div className="mt-12 text-center">
          <h2 className="text-3xl font-bold mb-4 text-[#013254]">Mi Carrito</h2> {/* Azul primario */}
          <Link href="/carrito">
            <div className="bg-[#FF5B31] text-white px-6 py-3 rounded-lg hover:bg-[#ff7f50] transition-colors inline-block">
              Ver carrito ({carrito.length} productos)
            </div>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
