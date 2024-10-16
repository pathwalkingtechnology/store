import Image from "next/image";
import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';
import Link from 'next/link'; // Para redirigir al carrito
import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero from '../components/Hero';

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
    setCarrito([...carrito, producto]);
    // Guardar carrito en localStorage (opcional si se desea persistir entre recargas)
    localStorage.setItem('carrito', JSON.stringify([...carrito, producto]));
  };

  return (
  <div>
      <Header carritoCount={carrito.length} />

      <Hero />
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Bienvenidos a Mao Store</h1>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {productos.map((producto) => (
          <li key={producto.id} className="border p-4 rounded-lg shadow-lg">
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-full h-48 object-cover mb-4 rounded-lg"
            />
            <h2 className="text-xl font-semibold">{producto.nombre}</h2>
            <p className="text-gray-600 mb-2">{producto.descripcion}</p>
            <p className="text-lg font-bold text-blue-600">${producto.precio.toFixed(2)}</p>
            <button
              onClick={() => agregarAlCarrito(producto)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Agregar al carrito
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Mi Carrito</h2>
        <Link href="/carrito">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
            Ver carrito ({carrito.length} productos)
          </div>
        </Link>
      </div>
    </div>
    <Footer />
    </div>
  );
}
