# PodcastAI

Transform your blog posts into engaging audio content in seconds using ElevenLabs AI.

## Features

- 🚀 Lightning-fast blog-to-audio conversion
- 🎙️ Studio-quality voice synthesis
- 📱 Responsive design for all devices
- 🔐 Secure user authentication
- ⚡ Real-time audio playback and download

## Environment Setup

### For Local Development

1. Copy `.env.example` to `.env`
2. Fill in your environment variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `VITE_ELEVENLABS_API_KEY`: Your ElevenLabs API key

### For Netlify Deployment

1. In your Netlify dashboard, go to Site Settings > Environment Variables
2. Add the following environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ELEVENLABS_API_KEY`

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your environment variables (see above)

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## API Keys

### ElevenLabs API Key
Get your API key from [ElevenLabs Dashboard](https://elevenlabs.io/app/speech-synthesis)

### Supabase Setup
1. Create a new project at [Supabase](https://supabase.com)
2. Get your project URL and anon key from the API settings
3. Set up authentication in your Supabase dashboard

## Deployment

This app is optimized for Netlify deployment. Simply connect your repository to Netlify and add the required environment variables in the Netlify dashboard.

## Tech Stack

- React + TypeScript
- Tailwind CSS
- Supabase (Authentication & Database)
- ElevenLabs AI (Text-to-Speech)
- Vite (Build Tool)