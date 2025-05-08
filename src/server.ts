import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import appRoutes from './routes/app.routes';
import authRoutes from './routes/v1/auth.routes';
import schoolRoutes from './routes/v1/branch.routes';
import classRoutes from './routes/v1/class.routes';

dotenv.config();
const app = express();

app.use(cors());

app.use(express.json());
app.use('/api/v1', appRoutes);
app.use('/api/v1', authRoutes);
app.use('/api/v1', schoolRoutes);
app.use('/api/v1', classRoutes);

const PORT = process.env.PORT || 5445;
app.listen(PORT, () =>
  console.log(`Server is running on port http://localhost:${PORT}`),
);
