import { supabase } from '../../supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { nombre, descripcion, precio, categoria_id, imagen } = req.body;

    const { data, error } = await supabase
      .from('productos')
      .insert([{ nombre, descripcion, precio, categoria_id, imagen }]);

    if (error) {
      res.status(500).json({ error: 'Error insertando el producto' });
    } else {
      res.status(200).json(data);
    }
  }
}
