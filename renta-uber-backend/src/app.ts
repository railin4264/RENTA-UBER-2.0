import express from 'express';
import cors from 'cors';
import path from 'path';
import driverRoutes from './routes/driverRoutes';
import reportRoutes from './routes/reportRoutes';
import authRoutes from './routes/authRoutes';
import vehicleRoutes from './routes/vehicleRoutes';
import paymentRoutes from './routes/paymentRoutes';
import expenseRoutes from './routes/expenseRoutes';
import guarantorRoutes from './routes/guarantorRoutes';
import debtRecordRoutes from './routes/debtRecordRoutes';
import uploadRoutes from './routes/uploadRoutes';
import statusRoutes from './routes/statusRoutes';
import contractRoutes from './routes/contractRoutes';



const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/drivers', driverRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/guarantors', guarantorRoutes);
app.use('/api/debtrecords', debtRecordRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/statuses', statusRoutes);
app.use('/api/contracts', contractRoutes);

export default app;


// ...existing code...
