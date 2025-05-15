export const securityConfig = {
  cors: {
    allowedOrigins: ['https://labelzoom.app'],
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  csp: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://js.stripe.com'],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      fontSrc: ["'self'", 'data:'],
      connectSrc: ["'self'", 'https://api.stripe.com', 'https://*.supabase.co'],
      frameSrc: ["'self'", 'https://js.stripe.com'],
    },
  },
  headers: {
    hsts: 'max-age=63072000; includeSubDomains; preload',
    xssProtection: '1; mode=block',
    frameOptions: 'SAMEORIGIN',
    contentTypeOptions: 'nosniff',
    referrerPolicy: 'strict-origin-when-cross-origin',
    permissionsPolicy: 'camera=(), microphone=(), geolocation=()',
  },
} as const; 