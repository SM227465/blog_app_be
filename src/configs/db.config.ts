import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from '../utils/logger.util';

const localDB = process.env.LOCAL_DB_URL;
// const cloudDB = process.env.CLOUD_DB_URL!;
// test?retryWrites=true&w=majority
const cloudDB = `mongodb+srv://vyrazuuser:wtsyVqAPFSYKYZRi@vyrazu.3bg3g4n.mongodb.net/`;

dotenv.config();

const connectWithDB = () => {
  mongoose
    .set('strictQuery', false)
    .connect(cloudDB)
    .then(() => logger.info('Connected to MongoDB.'))
    .catch((error) => {
      logger.error('Failed to connect with MongoDB.');
      logger.error(error.message);
      process.exit(1);
    });
};

export default connectWithDB;
