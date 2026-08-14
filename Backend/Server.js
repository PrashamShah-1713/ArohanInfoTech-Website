require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const cluster = require('cluster');
const os = require('os');
const http = require('http');

require('./Connection');
const authRoute = require('./Routes/authRoute');
const publicRoutes = require('./Routes/publicRoutes');
const adminRoutes = require('./Routes/adminRoutes');

const PORT = process.env.PORT || 3000;
const shouldUseCluster = process.env.NODE_ENV === 'production' && process.env.USE_CLUSTER === 'true';
const workerCount = Number(process.env.WORKERS || Math.min(os.cpus().length, 4));

function buildCacheKey(req) {
  const params = new URLSearchParams(req.query || {});

  if (req.path === '/api/public/internships') {
    params.set('page', params.get('page') || 'internships');
    params.set('isPublished', params.get('isPublished') || 'true');
  }

  if (req.path === '/api/public/projects') {
    params.set('isPublished', params.get('isPublished') || 'true');
  }

  if (req.path === '/api/public/team') {
    params.set('isPublished', params.get('isPublished') || 'true');
  }

  return `${req.path}?${params.toString()}`;
}

function createApp() {
  const app = express();
  const publicCache = new Map();

  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://arohaninfotech-frontend.onrender.com'
  ];

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin) {
          return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    })
  );

  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());

  app.use((req, res, next) => {
    if (req.method !== 'GET' || !req.path.startsWith('/api/public/')) {
      return next();
    }

    const cacheKey = buildCacheKey(req);
    const cachedEntry = publicCache.get(cacheKey);

    if (cachedEntry && cachedEntry.expiresAt > Date.now()) {
      res.set('X-Cache', 'HIT');
      res.set('Cache-Control', 'public, max-age=30');
      return res.json(cachedEntry.body);
    }

    const originalJson = res.json.bind(res);
    res.json = (body) => {
      publicCache.set(cacheKey, {
        body,
        expiresAt: Date.now() + 30_000,
      });
      res.set('X-Cache', 'MISS');
      res.set('Cache-Control', 'public, max-age=30');
      return originalJson(body);
    };

    next();
  });

  // Request logging middleware
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });

  app.use('/api/Users', authRoute);
  app.use('/api/public', publicRoutes);
  app.use('/api/admin', adminRoutes);

  app.get('/health', (req, res) => {
    const { getEmailStatus } = require('./utils/emailService');
    const emailStatus = getEmailStatus();
    res.json({
      success: true,
      status: 'Backend is running',
      email: emailStatus,
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/', (req, res) => {
    res.send('Arohan backend running');
  });

  // 404 handler
  app.use((req, res) => {
    console.log(`[404] No handler found for ${req.method} ${req.path}`);
    res.status(404).json({ success: false, message: 'Route not found' });
  });

  return app;
}

let app;

if (shouldUseCluster && cluster.isPrimary) {
  console.log(`Starting master process with ${workerCount} workers`);
  for (let index = 0; index < workerCount; index += 1) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} exited. Restarting...`);
    cluster.fork();
  });
} else {
  app = createApp();

  if (require.main === module) {
    const server = http.createServer(app);
    server.keepAliveTimeout = 65_000;
    server.headersTimeout = 70_000;

    server.listen(PORT, '0.0.0.0', () => {
      console.log('Server started at PORT : ' + PORT);
    });
  }
}

module.exports = app;