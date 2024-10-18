import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const admin = localStorage.getItem('admin');
    if (!admin) {
      router.push('/admin');
    }
  }, []);
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ul>
        <li><Link href="/admin/productos">Gestionar Productos</Link><br/></li>
        <li><Link href="/admin/categorias">Gestionar Categorías</Link></li>
      </ul>
    </div>
  );
}
