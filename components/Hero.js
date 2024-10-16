import Link from 'next/link';
export default function Hero() {
  return (
    <section className="bg-blue-500 text-white py-16">
      <div className="container mx-auto text-center px-4">
        <h1 className="text-4xl font-bold mb-4">¡Gran Promoción!</h1>
        <p className="text-xl mb-8">Compra hoy y obtén un 20% de descuento en nuestros productos seleccionados.</p>
        <Link href="/productos">
          <button className="bg-white text-blue-500 px-8 py-3 rounded-lg hover:bg-gray-200 transition">
            Ver Productos
          </button>
        </Link>
      </div>
    </section>
  );
}
