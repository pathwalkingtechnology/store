import { NextResponse } from 'next/server';
import { supabase } from './lib/supabase';

export async function middleware(req) {
  const { pathname, origin } = req.nextUrl;

  // Aplicar el middleware solo para rutas que empiezan con '/admin', excluyendo la página de login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = req.cookies['auth-token'];

    // Si no hay token, redirigir al login
    if (!token) {
      const loginUrl = new URL('/admin/login', origin);
      return NextResponse.redirect(loginUrl);
    }

    // Verificar el token y obtener el usuario
    const { user, error } = await supabase.auth.api.getUser(token);

    // Si no hay usuario o hay un error en la autenticación, redirigir al login
    if (!user || error) {
      const loginUrl = new URL('/admin/login', origin);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Si el usuario está autenticado o la ruta no es '/admin', continúa con la solicitud
  return NextResponse.next();
}
