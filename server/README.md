# StayFinder Server

This is the backend server for the StayFinder application, built with Node.js, Express, and MongoDB.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/stayfinder

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_token_secret_here
JWT_REFRESH_EXPIRES_IN=30d

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173

# Cookie Configuration
COOKIE_SECRET=your_cookie_secret_here
COOKIE_EXPIRES_IN=7
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. For production:
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update user profile
- `POST /api/auth/refresh` - Refresh access token

### Listings
- `GET /api/listings` - Get all listings
- `GET /api/listings/search` - Search listings
- `GET /api/listings/:id` - Get listing by ID
- `POST /api/listings` - Create new listing (host only)
- `PUT /api/listings/:id` - Update listing (host only)
- `DELETE /api/listings/:id` - Delete listing (host only)

## Error Handling

The server uses a centralized error handling system with the following features:
- Custom error classes for different types of errors
- Development and production error responses
- Proper error logging
- MongoDB error handling
- JWT error handling

## Security Features

- JWT-based authentication
- Refresh token rotation
- Secure cookie handling
- CORS protection
- Rate limiting (coming soon)
- Input validation
- XSS protection
- Helmet security headers

## Development

The server uses TypeScript for type safety and better development experience. Key features:
- Hot reloading in development
- TypeScript compilation
- ESLint for code quality
- Prettier for code formatting
- Jest for testing (coming soon)

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── models/         # Mongoose models
├── routes/         # API routes
├── types/          # TypeScript types
├── utils/          # Utility functions
├── app.ts          # App configuration
└── index.ts        # Server entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 