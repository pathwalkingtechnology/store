import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

export default function Checkout() {
  const [carrito, setCarrito] = useState([]);
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [provincia, setProvincia] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [telefono, setTelefono] = useState('');
  const router = useRouter();

  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
    setCarrito(carritoGuardado);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Insertar el pedido en la base de datos
      const { data: pedido, error: pedidoError } = await supabase
        .from('pedidos')
        .insert([
          {
            usuario_id: null,
            total: carrito.reduce((total, item) => total + item.precio * item.cantidad, 0),
            estado: 'pendiente',
          },
        ])
        .select()
        .single();

      if (pedidoError) {
        console.error('Error al guardar el pedido:', pedidoError);
        setMensaje('Ocurrió un error al procesar tu pedido.');
        return;
      }

      // Insertar los productos relacionados al pedido
      for (const producto of carrito) {
        const { error: productoError } = await supabase
          .from('pedidos_productos')
          .insert([
            {
              pedido_id: pedido.id,
              producto_id: producto.id,
              cantidad: producto.cantidad,
            },
          ]);

        if (productoError) {
          console.error('Error al guardar el producto del pedido:', productoError);
          setMensaje('Ocurrió un error al agregar productos al pedido.');
          return;
        }
      }

      // Insertar la información de envío
      const { data: envio, error: envioError } = await supabase
        .from('envios')
        .insert([
          {
            pedido_id: pedido.id,
            direccion: direccion,
            ciudad: ciudad,
            provincia: provincia,
            codigo_postal: codigoPostal,
            telefono: telefono,
          },
        ]);

      if (envioError) {
        console.error('Error al guardar el envío:', envioError);
        setMensaje('Ocurrió un error al procesar la información de envío.');
        return;
      }

      // Construir mensaje para WhatsApp
      const mensajeWhatsApp = `
      ¡Nuevo Pedido! 
      Nombre: ${nombre} 
      Dirección: ${direccion}, ${ciudad}, ${provincia}, ${codigoPostal}
      Teléfono: ${telefono}
      Productos: ${carrito.map((producto) => `${producto.nombre} x${producto.cantidad}`).join(', ')}
      Total: $${carrito.reduce((total, item) => total + item.precio * item.cantidad, 0).toFixed(2)}
      `;

      // Redirigir a WhatsApp Web o App con el mensaje y el número de la empresa
      const numeroEmpresa = '5493884072024';  // Coloca aquí el número de la empresa con código de país
      const urlWhatsApp = `https://wa.me/${numeroEmpresa}?text=${encodeURIComponent(mensajeWhatsApp)}`;
      window.location.href = urlWhatsApp;

      // Limpiar formulario y carrito
      setNombre('');
      setDireccion('');
      setCiudad('');
      setProvincia('');
      setCodigoPostal('');
      setTelefono('');
      localStorage.removeItem('carrito');
    } catch (error) {
      console.error('Error en el proceso de checkout:', error);
      setMensaje('Ocurrió un error inesperado.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {mensaje && <p className="text-green-600">{mensaje}</p>}

      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">Resumen del pedido</h2>
        <ul className="mb-4">
          {carrito.length > 0 ? (
            carrito.map((producto, index) => (
              <li key={index} className="flex justify-between py-2 border-b">
                <span>{producto.nombre}</span>
                <span>${producto.precio.toFixed(2)}</span>
              </li>
            ))
          ) : (
            <li className="text-gray-500">El carrito está vacío.</li>
          )}
        </ul>
        {carrito.length > 0 && (
          <div className="text-right font-bold text-xl">
            Total: ${carrito.reduce((total, item) => total + item.precio * item.cantidad, 0).toFixed(2)}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
        {/* Formulario de dirección */}
        <div className="mb-4">
          <label className="block text-gray-700">Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Dirección:</label>
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Ciudad:</label>
          <input
            type="text"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Provincia:</label>
          <input
            type="text"
            value={provincia}
            onChange={(e) => setProvincia(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Código Postal:</label>
          <input
            type="text"
            value={codigoPostal}
            onChange={(e) => setCodigoPostal(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
           Número de Teléfono
          </label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Confirmar Pedido
        </button>
      </form>
    </div>
  );
}
