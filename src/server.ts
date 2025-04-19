import dotenv from 'dotenv';
import express from 'express';
import appRoutes from './routes/app.routes';
import authRoutes from './routes/v1/auth.routes';
import userRoutes from './routes/v1/user.routes';
import schoolRoutes from './routes/v1/school.routes';
import classRoutes from './routes/v1/class.routes';

dotenv.config();
const app = express();

app.use(express.json());
app.use('/api/v1', appRoutes);
app.use('/api/v1', authRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', schoolRoutes);
app.use('api/v1', classRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server is running on port http://localhost:${PORT}`),
);
