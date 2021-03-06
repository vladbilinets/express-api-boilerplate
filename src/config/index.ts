import dotenv from 'dotenv';

dotenv.config();

const MONGO_HOST = process.env.MONGO_URL || 'localhost:5000';
const MONGO_DATABASE = process.env.MONGO_DATABASE || 'smartcalendar';
const MONGO_USERNAME = process.env.MONGO_USERNAME || 'root';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || 'password';
const MONGO_OPTIONS = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
    poolSize: 50,
    autoIndex: false,
    retryWrites: false,
    auth: {
        authSource: 'admin',
        user: MONGO_USERNAME,
        password: MONGO_PASSWORD,
    },
};

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || 1337;
const SERVER_TOKEN_EXPIRETIME = process.env.SERVER_TOKEN_EXPIRETIME || 3600;
const SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER || 'issuer';
const SERVER_TOKEN_SECRET = process.env.SERVER_TOKEN_SECRET || 'secret';
const SERVER_REFRESH_TOKEN_EXPIRETIME = process.env.SERVER_REFRESH_TOKEN_EXPIRETIME || 31536000;
const SERVER_REFRESH_TOKEN_SECRET = process.env.SERVER_REFRESH_TOKEN_SECRET || 'refresh_secret';

const config = {
    env: process.env.NODE_ENV,
    mongo: {
        host: MONGO_HOST,
        options: MONGO_OPTIONS,
        url: `mongodb://${MONGO_HOST}/${MONGO_DATABASE}`,
    },
    server: {
        hostname: SERVER_HOSTNAME,
        port: SERVER_PORT,
        token: {
            expireTime: SERVER_TOKEN_EXPIRETIME,
            issuer: SERVER_TOKEN_ISSUER,
            secret: SERVER_TOKEN_SECRET,
        },
        refreshToken: {
            expireTime: SERVER_REFRESH_TOKEN_EXPIRETIME,
            secret: SERVER_REFRESH_TOKEN_SECRET,
        },
    },
};

export default config;
