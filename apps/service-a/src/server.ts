import dotenv from 'dotenv';
dotenv.config();
import app from './app';

const PORT = Number(process.env.PORT) || 3000;
const start = async () => {
  app.listen(PORT, () => {
    console.log('job submitter service started at port 3000');
  });
};

start();
