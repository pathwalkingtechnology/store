import { supabase } from './supabase';
import bcrypt from 'bcryptjs';

export const loginAdmin = async (email, password) => {
  const { data: admin, error } = await supabase
    .from('admin')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !admin) {
    throw new Error('Usuario o contraseña incorrectos');
  }

  const isValidPassword = await bcrypt.compare(password, admin.password_hash);

  if (!isValidPassword) {
    throw new Error('Usuario o contraseña incorrectos');
  }

  return admin;
};
