export default () => ({
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'IndeX@811',
    database: process.env.DB_NAME || 'QuanLyNhanSu_V2',
    driver: process.env.DB_DRIVER || 'postgres',
  },
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/hrm_logs',
  },
  port: parseInt(process.env.PORT || '3456'),
});
