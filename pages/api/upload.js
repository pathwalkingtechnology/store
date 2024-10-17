import { upload } from '../../uploadConfig';
import nextConnect from 'next-connect';

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Error al subir archivo: ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Método ${req.method} no permitido` });
  },
});

apiRoute.use(upload.single('imagen'));

apiRoute.post(async (req, res) => {
  const fileName = req.file.filename;

  // Aquí deberías hacer la lógica para guardar el producto con el nombre de la imagen
  res.status(200).json({ fileName });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disabilitar bodyParser para usar multer
  },
};
