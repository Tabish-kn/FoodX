import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  demoMode: process.env.DEMO_MODE !== 'false',
  jwt: {
    secret: process.env.JWT_SECRET || 'foodx-jwt-super-secret-key-development-32chars-min',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'foodx-jwt-refresh-super-secret-key-32chars-min',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },
  corsOrigin: process.env.NEXT_PUBLIC_APP_URL || '*'
};
