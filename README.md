# GrowthPath Platform

A modern learning platform built with Next.js 14 (App Router), Tailwind CSS, and MongoDB.

## Features

- User authentication with NextAuth.js
- MongoDB integration for data persistence
- Modern UI with Tailwind CSS
- Responsive design for all devices
- Learning path management
- Child progress tracking

## Getting Started

1. Clone the repository:
```bash
git clone <your-repo-url>
cd gp-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Update the variables with your values:
     - `MONGODB_URI`: Your MongoDB connection string
     - `NEXTAUTH_URL`: Your application URL (http://localhost:3000 for local development)
     - `NEXTAUTH_SECRET`: A random string for session encryption

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Tech Stack

- [Next.js 14](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [MongoDB](https://www.mongodb.com/) - Database
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Material-UI](https://mui.com/) - UI components
- [LottieFiles](https://lottiefiles.com/) - Animations

## Project Structure

```
src/
├── app/              # Next.js app directory
├── components/       # React components
├── lib/             # Utility functions
├── models/          # MongoDB models
└── styles/          # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
