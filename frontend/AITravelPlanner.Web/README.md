# AI Travel Planner — Frontend Client

A responsive Single-Page Application (SPA) built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS** using the Emerald Luxury design system.

## Features
- **Interactive Trip Planner**: Conversational natural-language prompt input and structured preference toggles.
- **Visual Itinerary & Pricing**: Bounded hotel rate cards, daily schedule timelines, and live weather badges.
- **Autonomous Replanning Modal**: Dynamic constraint adjustment and real-time re-optimization.
- **User Dashboard ("My Saved Trips")**: Saved trip review, full detail retrieval, and cascading deletion.
- **Curated Destination Explorer**: Tag filtering (beach, hills, tea, heritage, adventure, food, spiritual) and quick-plan initiation.
- **Print & PDF Layout**: Clean `@media print` paper styles hiding interactive controls.
- **Authentication**: JWT session state with persistent local storage and automated 401 interception.

## Local Development
```bash
# Install dependencies
npm install

# Start local Vite development server
npm run dev

# Build production bundle
npm run build
```
Default URL: `http://localhost:5173`
Backend Proxy Target: `http://localhost:5000`
