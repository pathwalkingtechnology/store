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

  // Cargar el carrito desde localStorage cuando el componente se monta
  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
    setCarrito(carritoGuardado);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Insertar el pedido en la tabla 'pedidos'
      const { data: pedido, error: pedidoError } = await supabase
        .from('pedidos')
        .insert([
          {
            usuario_id: null, // Usuario no registrado
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

      // Insertar productos en la tabla 'pedidos_productos'
      for (const producto of carrito) {
        const { error: productoError } = await supabase
          .from('pedidos_productos')
          .insert([
            {
              pedido_id: pedido.id, // Asociar el producto al pedido insertado
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

      // Insertar la información de envío en la tabla 'envios'
      const { data: envio, error: envioError } = await supabase
        .from('envios')
        .insert([
          {
            pedido_id: pedido.id, // Asociar el envío al pedido insertado
            direccion: direccion,
            ciudad: ciudad,
            provincia: provincia,
            codigo_postal: codigoPostal,
            telefono: telefono,
          },
        ]);

      if (envioError) {
        console.error('Error al guardar la información de envío:', envioError);
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

      // Redirigir a WhatsApp con el mensaje
      const numeroEmpresa = '5493884072024';  // Cambia este número al de la empresa
      const urlWhatsApp = `https://wa.me/${numeroEmpresa}?text=${encodeURIComponent(mensajeWhatsApp)}`;
      window.location.href = urlWhatsApp;

      // Limpiar el formulario y el carrito
      setNombre('');
      setDireccion('');
      setCiudad('');
      setProvincia('');
      setCodigoPostal('');
      setTelefono('');
      localStorage.removeItem('carrito');
    } catch (error) {
      console.error('Error inesperado al procesar el pedido:', error);
      setMensaje('Ocurrió un error inesperado. Intenta nuevamente.');
    }
  };

  return (
    <div>
      <h1>Checkout</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Dirección"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Ciudad"
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Provincia"
          value={provincia}
          onChange={(e) => setProvincia(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Código Postal"
          value={codigoPostal}
          onChange={(e) => setCodigoPostal(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          required
        />
        <button type="submit">Realizar Pedido</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}
