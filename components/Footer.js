import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto text-center">
        <p className="mb-2">© 2024 Mao Store. Todos los derechos reservados.</p>
        <a href="https://path-website-five.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex justify-end">
          <Image src="/firma.png" alt="Firma" width={90} height={40} className="cursor-pointer" />
        </a>
      </div>
    </footer>
  );
}
