import { NextResponse } from 'next/server';
import { supabase } from './lib/supabase';

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Aplicar el middleware solo para rutas específicas, en este caso '/admin'
  if (pathname.startsWith('/admin')) {
    const token = req.cookies['auth-token'];

    // Si no hay token, redirigir al login
    if (!token) {
      return NextResponse.redirect('/login');
    }

    // Verificar el token y obtener el usuario
    const { user, error } = await supabase.auth.api.getUser(token);

    // Si no hay usuario o hay un error en la autenticación, redirigir al login
    if (!user || error) {
      return NextResponse.redirect('/login');
    }
  }

  // Si el usuario está autenticado, continúa con la solicitud
  return NextResponse.next();
}
