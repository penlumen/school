import dotenv from 'dotenv';
import express from 'express';
import appRoutes from './routes/app.routes';
import authRoutes from './routes/v1/auth.routes';
import schoolRoutes from './routes/v1/school.routes';

dotenv.config();
const app = express();

app.use(express.json());
app.use('/api/v1', appRoutes);
app.use('/api/v1', authRoutes);
app.use('/api/v1', schoolRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server is running on port http://localhost:${PORT}`),
);
