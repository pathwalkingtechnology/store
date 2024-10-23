import { NextResponse } from 'next/server';
import { supabase } from './lib/supabase';

export async function middleware(req) {
  const { nextUrl, cookies } = req;
  const token = cookies['auth-token'];

  // Si no hay token, redirigir al login usando una URL absoluta
  if (!token) {
    const url = new URL('/login', req.url);  // Construye una URL absoluta
    return NextResponse.redirect(url);
  }

  // Verificar el token y obtener el usuario
  const { user, error } = await supabase.auth.api.getUser(token);

  // Si no hay usuario o hay un error en la autenticación, redirigir al login
  if (!user || error) {
    const url = new URL('/login', req.url);  // Construye una URL absoluta
    return NextResponse.redirect(url);
  }

  // Si el usuario está autenticado, continúa con la solicitud
  return NextResponse.next();
}
