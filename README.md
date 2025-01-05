# Social Media Analyser

An intelligent analytics tool that provides detailed insights for different types of social media content including reels, static images, and carousels.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://social-media-performance-analyser.vercel.app/)

## Overview

Social Media Analyser helps content creators and marketers make data-driven decisions by analyzing engagement patterns and performance metrics across various content formats. The tool leverages AI to provide actionable insights and recommendations.

## Features

- **Multi-format Analysis**: Support for reels, static images, and carousel posts
- **AI-Powered Insights**: Intelligent analysis using advanced AI models
- **Interactive Dashboard**: Visual representation of analytics data
- **Custom Recommendations**: Tailored suggestions for content improvement
- **Historical Tracking**: Monitor performance trends over time

## Technology Stack

### Frontend
- React.js for the user interface
- Modern responsive design
- Real-time data visualization

### Backend
- Fastify server for high-performance API endpoints
- AI Integration:
  - Langflow for AI agent creation
  - Groq AI model for intelligent analysis
- Astra DB for scalable data storage

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Access to required API keys (Groq, Astra DB)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/social-media-analyser.git
cd social-media-analyser
```

2. Install dependencies
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

3. Configure environment variables
```bash
# Create .env files in both frontend and backend directories
cp .env.example .env
```

4. Start the development servers
```bash
# Frontend
npm run dev

# Backend
npm run dev
```

## Problem Statement

For detailed information about the project's objectives and requirements, please refer to our [Problem Statement](./public/HACKATHON_PROBLEM_STATEMENT.pdf).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Langflow](https://astra.datastax.com/langflow) for AI agent creation
- [Groq](https://groq.com/) for AI model implementation
- [Astra DB](https://astra.datastax.com/) for database solutions

## Contact

For questions and support, please open an issue in the repository or contact the maintainers.

Project Link: [https://github.com/kancherish/social-media-analyser](https://github.com/yourusername/social-media-analyser)
