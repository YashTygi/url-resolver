# 🔍 URL Resolver - AI-Powered Manga/Manhwa Metadata Extractor

> Intelligent web scraper that automatically extracts comprehensive metadata from manga, manhwa, and webnovel URLs using AI.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-1.x-orange.svg)](https://bun.sh/)

## 🌟 Features

- **Smart Navigation**: Automatically detects chapter pages and navigates to series home for comprehensive data
- **AI-Powered Parsing**: Uses GPT-4o-mini to intelligently extract metadata from any manga/manhwa site
- **Chapter Detection**: Identifies and tracks the specific chapter you're viewing
- **Cover Image Extraction**: Automatically finds and returns the best quality cover image
- **Headless Browsing**: Uses Playwright for reliable data extraction from dynamic websites
- **Comprehensive Metadata**: Extracts title, synopsis, author, artist, genres, status, chapters, ratings, and more

## 📋 What It Extracts

The API returns a rich JSON object containing:

- **Title**: Clean series name (without chapter suffixes)
- **Synopsis**: Plot summary/description
- **Author**: Writer name
- **Artist**: Illustrator name
- **Serialization**: Publishing platform (e.g., "Weekly Shonen Jump", "Naver Webtoon")
- **Genres**: Array of genre tags
- **Status**: "Ongoing", "Completed", "Hiatus", or "Unknown"
- **Total Chapters**: Highest chapter number available
- **Updated On**: Last update timestamp
- **Rating**: User rating (out of 5.0 or 10.0)
- **Cover URL**: Direct link to cover image
- **Targeted Chapter**: The specific chapter you were viewing (if applicable)

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) runtime (v1.0+)
- OpenAI API Key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/url-resolver.git
cd url-resolver
```

2. Install dependencies:
```bash
bun install
```

3. Create a `.env` file:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the server:
```bash
bun run dev    # Development mode with hot reload
# or
bun run start  # Production mode
```

The server will start on `http://localhost:3000`

## 📡 API Usage

### Endpoint

```
POST /resolve
```

### Request

```bash
curl -X POST http://localhost:3000/resolve \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/manga/solo-leveling/chapter-10"}'
```

### Response

```json
{
  "title": "Solo Leveling",
  "synopsis": "Ten years ago, 'the Gate' appeared and connected the real world...",
  "author": "Chugong",
  "artist": "DUBU (REDICE STUDIO)",
  "serialization": "Naver Webtoon",
  "genres": ["Action", "Adventure", "Fantasy"],
  "status": "Completed",
  "totalChapters": 179,
  "updatedOn": "2 days ago",
  "rating": 4.8,
  "coverUrl": "https://example.com/covers/solo-leveling.jpg",
  "sourceUrl": "https://example.com/manga/solo-leveling/chapter-10",
  "targetedChapter": "Chapter 10"
}
```

### Error Response

```json
{
  "error": "Extraction Failed",
  "details": "Navigation timeout of 25000ms exceeded"
}
```

## 🏗️ Architecture

The resolver uses a three-stage process:

1. **Smart Navigation** (`index.ts`):
   - Detects if URL is a chapter page
   - Extracts chapter information
   - Navigates to series home page for complete metadata

2. **Content Extraction** (Playwright):
   - Renders JavaScript-heavy pages
   - Extracts text content and images
   - Handles various site structures

3. **AI Parsing** (`aiParser.ts`):
   - Sends page content to GPT-4o-mini
   - Uses structured prompts for consistent extraction
   - Returns validated JSON metadata

## 🛠️ Tech Stack

- **Runtime**: [Bun](https://bun.sh/) - Fast JavaScript runtime
- **Framework**: [Express](https://expressjs.com/) - Web framework
- **Browser Automation**: [Playwright](https://playwright.dev/) - Headless browser
- **HTML Parsing**: [Cheerio](https://cheerio.js.org/) - Fast HTML parser
- **AI**: [OpenAI GPT-4o-mini](https://platform.openai.com/) - Intelligent text parsing
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript

## 📂 Project Structure

```
url-resolver/
├── index.ts          # Main Express server & navigation logic
├── aiParser.ts       # OpenAI integration & prompt engineering
├── package.json      # Dependencies & scripts
├── tsconfig.json     # TypeScript configuration
├── bun.lock          # Dependency lock file
├── .env              # Environment variables (not committed)
├── .gitignore        # Git ignore rules
└── README.md         # Documentation
```

## 🎯 Use Cases

- **Reading Apps**: Auto-populate manga/manhwa metadata in your reading app
- **Library Management**: Batch process URLs to build your collection database
- **Recommendation Systems**: Extract genre and rating data for recommendations
- **Progress Tracking**: Identify which chapter users are reading
- **Data Aggregation**: Collect metadata from multiple sources

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |

### Port Configuration

Change the default port (3000) in `index.ts`:

```typescript
const port = process.env.PORT || 3000;
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for the GPT-4o-mini API
- Playwright team for the excellent browser automation tool
- The manga/manhwa community for inspiration

## 📧 Contact



Project Link: [https://github.com/YashTygi/url-resolver](https://github.com/YashTygi/url-resolver)

---

⭐ If you find this project useful, please consider giving it a star on GitHub!
