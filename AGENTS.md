# Installed Skills

Quick reference for all installed agent skills and what they do.

| Skill Name                      | What It Does                                                                     |
| ------------------------------- | -------------------------------------------------------------------------------- |
| **api-design-principles**       | Design clean REST and GraphQL APIs that are easy for developers to use           |
| **api-endpoint-generator**      | Auto-generate API routes with validation, error handling, and TypeScript types   |
| **code-review-excellence**      | Give helpful feedback on code changes, catch bugs, and share knowledge with team |
| **conventional-commit**         | Create standardized commit messages following best practices                     |
| **core-web-vitals**             | Speed up your website and fix performance issues (LCP, INP, CLS)                 |
| **javascript-testing-patterns** | Write unit tests, integration tests, and end-to-end tests with Jest/Vitest       |
| **modern-javascript-patterns**  | Use modern JavaScript features (async/await, destructuring, etc.)                |
| **nodejs-backend-patterns**     | Build scalable Node.js servers with authentication, databases, and APIs          |
| **nodejs-express-server**       | Create Express.js servers with routing, middleware, and request handling         |
| **responsive-design**           | Make websites look good on all screen sizes (mobile, tablet, desktop)            |
| **tech-debt-prioritizer**       | List and rank technical debt by impact to plan what to fix first                 |
| **wcag-audit-patterns**         | Check website for accessibility issues and fix them for all users                |

---

# AGENTS.md

This file provides guidance to any coding agent when working with code in this repository.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Add MAPTILER_KEY to .env (get free key from maptiler.com)

# Development (auto-reload with nodemon)
npm run dev

# Production
npm start
```

Server runs on `http://localhost:3000` by default.

## Project Overview

**Parampara** is a community-driven digital archive platform for preserving rural cultural heritage. It provides interactive maps, audio stories, galleries, heritage paths, and AI chat about traditions.

**Key Architecture**: Express.js REST API backend with vanilla HTML/CSS/JavaScript frontend. Data is stored in-memory (not persisted).

## Technology Stack

- **Backend**: Node.js, Express.js, dotenv
- **Frontend**: HTML5, CSS3, ES6+ JavaScript (no frameworks)
- **Maps**: MapLibre GL JS, MapTiler API
- **Middleware**: CORS, body-parser, custom error handling

## Code Architecture

### Backend Structure

```
routes/          # API route handlers
├── item.routes.js       (GET /api/items, POST /api/items)
├── path.routes.js       (heritage paths)
├── progress.routes.js   (user progress/quest tracking)
├── post.routes.js       (village posts/live updates)
├── chat.routes.js       (AI chat)
├── checkin.routes.js    (GPS check-in badges)
└── map.config.js        (map configuration)

controllers/     # Business logic and request handling
├── item.controller.js
├── path.controller.js
├── progress.controller.js
├── post.controller.js
├── chat.controller.js
└── checkin.controller.js

data/
└── store.js     # In-memory data store (4 collections: culturalItems, heritagePaths, userProgress, villagePosts)

config/
└── sampleData.js # Initialize store with sample data on startup

middleware/
├── errorHandler.js      # Error middleware
└── notFound.js          # 404 middleware

public/         # Frontend files
├── index.html, map.html, gallery.html, paths.html, quest.html, trails.html, chat.html (404.html)
├── styles/    # CSS per page
└── scripts/   # JS per page (no bundler/module system)
```

### Data Model

All data stored in `data/store.js`:

```javascript
culturalItems: [
  {
    id: string,
    title: string,
    type: "visual" | "audio" | "story",
    location: string,
    coordinates: [lat, lng],
    description: string,
    tags: string[],
    timestamp: ISO datetime,
    // additional fields per feature
  }
]

heritagePaths: [
  {
    id: string,
    title: string,
    theme: string,
    // connects multiple items narratively
  }
]

userProgress: {
  [userId]: {
    questsCompleted: string[],
    badgesEarned: string[],
    itemsVisited: string[],
    // tracks user journey
  }
}

villagePosts: [
  {
    id: string,
    villageId: string,
    content: string,
    timestamp: ISO datetime,
    // live updates from villages
  }
]
```

### API Endpoints

- `GET /api/items` - List all cultural items
- `POST /api/items` - Create new item
- `GET /api/paths` - List heritage paths
- `POST /api/paths` - Create path
- `GET /api/progress/:userId` - User quest progress
- `POST /api/progress/:userId/quest/:questId` - Mark quest complete
- `GET /api/posts` - Village posts
- `POST /api/posts` - Create post
- `POST /api/chat` - Chat with AI curator
- `POST /api/checkin` - GPS check-in for badges
- `GET /api/map-style` - MapTiler style JSON (requires MAPTILER_KEY)
- `GET /api/language` - Supported languages (en, hi, mr)

## Development Patterns

**Request Flow**: Route → Controller → Data Store → Response

**Controllers**: Each controller exports functions matching route methods. Handle validation, transform data, manage errors. Example pattern from `item.controller.js`:

```javascript
const getItems = (req, res, next) => {
  try {
    const items = store.culturalItems;
    res.json(items);
  } catch (err) {
    next(err); // Pass to errorHandler middleware
  }
};
```

**Error Handling**: Pass errors to `next(err)` which routes to errorHandler middleware. Don't catch and respond—let middleware standardize.

**CORS**: Enabled globally. Frontend (port 3000+) calls backend API at same origin.

**Sample Data**: `config/sampleData.js` runs on startup. Initialize store with data for testing.

## Environment Variables

```
PORT=3000                           # Server port (default 3000)
MAPTILER_KEY=your_maptiler_key     # Free from maptiler.com (required for maps)
```

## Frontend

Frontend is vanilla JS—no bundler, no framework. Each page has:

- `public/[page].html` - Structure
- `public/styles/[page].css` - Styling
- `public/scripts/[page].js` - Logic

Frontend fetches from `/api/*` endpoints. Supports 3 languages: en, hi, mr (language switching via dropdown).

## Important Notes

- **In-Memory Storage**: Data resets on server restart. No database persistence. For production, connect a database to `data/store.js` or replace with DB calls.
- **No Build Step**: Frontend is vanilla JS. CSS/HTML are static.
- **MapTiler Required**: Map features disabled without MAPTILER_KEY. Backend returns 503 with setup instructions.
- **Nodemon**: Dev mode watches server.js changes. Restart needed for frontend file changes.

## Common Tasks

**Add a new API endpoint**:

1. Create route handler in `routes/[feature].routes.js`
2. Create controller function in `controllers/[feature].controller.js`
3. Import and mount route in `server.js` under `// API Routes`
4. Update data model in `data/store.js` if needed

**Add sample data**: Edit `config/sampleData.js` to initialize store collections.

**Debugging**: Check `middleware/errorHandler.js` for error response format. Frontend errors log to browser console.
