import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import appRoutes from './routes/app.routes';
import authRoutes from './routes/v1/auth.routes';
import userRoutes from './routes/v1/user.routes';
import schoolRoutes from './routes/v1/branch.routes';
import GradeRoutes from './routes/v1/grade.route';
import classRoutes from './routes/v1/class.routes';
import subjectRoutes from './routes/v1/subject.routes';
import StudentRoutes from './routes/v1/student.routes';
import dashboardRoutes from './routes/v1/dashboard.routes';

dotenv.config();
const app = express();

app.use(cors());

app.use(express.json());
app.use('/api/v1', appRoutes);
app.use('/api/v1', authRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', schoolRoutes);
app.use('/api/v1', GradeRoutes);
app.use('/api/v1', classRoutes);
app.use('/api/v1', subjectRoutes);
app.use('/api/v1', StudentRoutes);
app.use('/api/v1', dashboardRoutes);

const PORT = process.env.PORT || 5445;
app.listen(PORT, () =>
  console.log(`Server is running on port http://localhost:${PORT}`),
);
