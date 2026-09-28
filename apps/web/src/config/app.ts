export const APP_CONFIG = {
  name: 'NearNest',
  tagline: 'Your Neighborhood, Connected & Thriving',
  description: 'Connect with neighbors, discover local businesses, hire service providers, and build genuine community ties.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000',
  support: {
    email: 'urveshrane3206@gmail.com',
    phone: '+91 9373571631',
    office: 'Ajeenkya D Y Patil University, Pune, Maharashtra, India',
  },
  social: {
    twitter: 'https://twitter.com/nearnest',
    facebook: 'https://facebook.com/nearnest',
    instagram: 'https://instagram.com/nearnest',
    linkedin: 'https://linkedin.com/company/nearnest',
  },
  legal: {
    privacyPolicy: '/legal/privacy',
    termsOfService: '/legal/terms',
    cookiePolicy: '/legal/cookies',
  },
} as const;
