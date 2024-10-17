import Link from 'next/link';

export default function Dashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ul>
        <li><Link href="/admin/productos">Gestionar Productos</Link></li>
        <li><Link href="/admin/categorias">Gestionar Categorías</Link></li>
      </ul>
    </div>
  );
}
