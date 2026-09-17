import express from 'express';
import cors from 'cors';
import roadmapRoutes from './routes/roadmapRoutes';
import aiRoutes from './routes/aiRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// API Endpoints
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', service: 'Skill Compass Node.js Backend', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Skill Compass Server running on http://localhost:${PORT}`);
});
