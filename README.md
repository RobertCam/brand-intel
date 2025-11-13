# Brand Intelligence App

A Next.js application that generates Brand Visibility Snapshots and Sales Starter Kits using OpenAI's GPT-4o-mini model.

## 🚀 New Feature: Web Search Integration!

```
Me: "I need to analyze this brand"
AI: "Let me just... *searches the entire internet*"
Me: "Perfect, exactly what I needed"
```

Now powered by OpenAI's Responses API with `web_search` - because sometimes you need the AI to actually Google things for you! 🔍✨

## Features

- **Brand Visibility Snapshot**: Analyzes what a brand does, their category, offerings, target segments, brand voice, and visibility opportunities (now with real-time web search! 🌐)
- **Sales Starter Kit**: Generates buyer roles, pain points, value angles, cold email openers, LinkedIn DM messages, discovery questions, and thought-leadership talking points
- **Web Search Integration**: Uses OpenAI's Responses API to fetch current information from the internet, ensuring your brand analysis is always up-to-date

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory with your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter a brand name or URL in the input field
2. Click "Generate"
3. View the Brand Visibility Snapshot and Sales Starter Kit results

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- OpenAI API (gpt-4o-mini)

## Deployment

This app is ready to deploy on Vercel. Make sure to add your `OPENAI_API_KEY` as an environment variable in your Vercel project settings.

