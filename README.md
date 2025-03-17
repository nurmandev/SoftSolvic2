# AI Interview Coach

## Overview
AI Interview Coach is a comprehensive platform designed to help job seekers practice and improve their interview skills through AI-powered feedback and analysis.

## Features

### User Authentication
- Secure signup and login system
- User profile management
- Protected routes requiring authentication

### Interview Practice
- Customizable interview sessions based on job role, industry, and difficulty
- Support for multiple question types: behavioral, technical, coding, leadership
- Real-time speech recognition and recording
- Code editor with execution capabilities for technical interviews

### AI-Powered Analysis
- Detailed feedback on each response
- Performance metrics (confidence, clarity, content quality, pacing)
- Personality insights based on communication style
- Strengths and areas for improvement

### Learning Tools
- Personalized learning plan
- Interview history tracking
- Calendar integration for scheduling practice sessions
- Progress analytics and improvement tracking

## Technical Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **UI Components**: ShadCN UI
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **AI Integration**: DeepSeek AI API
- **Code Execution**: In-browser JavaScript execution

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/ai-interview-coach.git
   cd ai-interview-coach
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables
   Create a `.env` file with the following variables:
   ```
   VITE_DEEPSEEK_API_KEY=your_deepseek_api_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server
   ```
   npm run dev
   ```

## Usage

1. **Sign up/Login**: Create an account or log in to access the platform
2. **Dashboard**: View your interview history, upcoming sessions, and learning plan
3. **Setup Interview**: Configure your practice interview settings
4. **Practice**: Complete the interview session with AI-powered feedback
5. **Results**: Review detailed analysis and improvement suggestions

## Database Schema

The application uses the following main tables:
- `user_profiles`: User information and preferences
- `interview_sessions`: Configuration details for interview sessions
- `interview_results`: Responses and analysis from completed interviews
- `interview_notes`: User notes taken during interview sessions
- `scheduled_interviews`: Calendar events for upcoming practice sessions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
