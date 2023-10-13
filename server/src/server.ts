import 'dotenv/config';
import './config/db';
import app from './app';
import logger from './config/logger';

const port = process.env.PORT || 3000;

const handleListening = () => {
  logger.info(`✅ Server listening on port ${port}`);
};

app.listen(port, handleListening);
