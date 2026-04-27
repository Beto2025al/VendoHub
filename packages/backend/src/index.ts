import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '0.1.0'
  });
});

// API v1 routes (to be implemented)
app.use('/api/v1/clientes', (req, res) => {
  res.json({ mensaje: 'Ruta de clientes - proxima implementación' });
});

app.use('/api/v1/productos', (req, res) => {
  res.json({ mensaje: 'Ruta de productos - proxima implementación' });
});

app.use('/api/v1/ventas', (req, res) => {
  res.json({ mensaje: 'Ruta de ventas - proxima implementación' });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({
    exito: false,
    mensaje: 'Error interno del servidor',
    errores: {
      server: [err.message]
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 VendoHub Backend ejecutándose en http://localhost:${PORT}`);
});
