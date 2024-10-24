import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminIndex() {
  const router = useRouter();

  useEffect(() => {
    const adminId = localStorage.getItem('admin');

    // Si el usuario no está autenticado, redirigir a login
    if (!adminId) {
      router.push('/admin/login');
    } else {
      // Si está autenticado, redirigir al dashboard
      router.push('/admin/dashboard');
    }
  }, [router]);

  return (
    <div>
      <h1>Redireccionando...</h1>
    </div>
  );
}
