import express from 'express';
import { reportsRouter } from './routes/reportsRoute.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/reports', reportsRouter);

app.listen(PORT, function (err) {
  console.log('Server listening on Port', PORT);
});