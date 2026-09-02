export const APP_CONFIG = {
  name: 'NeighbourHub',
  tagline: 'Your Neighborhood, Connected & Thriving',
  description: 'Connect with neighbors, discover local businesses, hire service providers, and build genuine community ties.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000',
  support: {
    email: 'support@neighbourhub.com',
    phone: '+1-800-NEIGHBOUR',
  },
  social: {
    twitter: 'https://twitter.com/neighbourhub',
    facebook: 'https://facebook.com/neighbourhub',
    instagram: 'https://instagram.com/neighbourhub',
    linkedin: 'https://linkedin.com/company/neighbourhub',
  },
  legal: {
    privacyPolicy: '/legal/privacy',
    termsOfService: '/legal/terms',
    cookiePolicy: '/legal/cookies',
  },
} as const;
