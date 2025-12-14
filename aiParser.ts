import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!, // Make sure this is in your .env file
});

export async function parseWithAI(text: string, sourceUrl: string) {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini", // Fast & Cost effective
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are a metadata extractor for Manga, Manhwa, and Webnovels. 
        Analyze the provided page text and extract the details in strict JSON format.
        
        Fields to Extract:
        - title (String): Clean Series Title (remove "Chapter X" or "Read Online" suffixes).
        - synopsis (String): The summary/plot description. Return "No synopsis available" if missing.
        - author (String): Name of the writer.
        - artist (String): Name of the artist.
        - serialization (String): The magazine or platform (e.g., "Weekly Shonen Jump", "Naver Webtoon").
        - genres (Array of Strings): e.g., ["Action", "Fantasy"].
        - status (String): "Ongoing", "Completed", "Hiatus", or "Unknown".
        - totalChapters (Number): Highest chapter number found. 0 if unknown.
        - updatedOn (String): Last update string found (e.g., "2 days ago", "Dec 2023").
        -rating (Number) : Average user rating out of 5.0 or 10.0 scale. Null if not available.

        JSON Output Example:
        {
          "title": "Example Manga Title",
          "synopsis": "This is an example synopsis of the manga.",
          "author": "John Doe",
          "artist": "Jane Smith",
          "serialization": "Weekly Shonen Jump",
          "genres": ["Action", "Adventure", "Fantasy"],
          "status": "Ongoing",
          "totalChapters": 120,
          "updatedOn": "3 days ago",
          "rating": 4.5
        }

        Rules:
        1. If you see multiple titles (breadcrumbs), the most prominent non-chapter title is the Series Title.
        2. Do not hallucinate. If a field is missing, return null or empty string/array.
        3. The text is from this URL: ${sourceUrl} (Use this context if helpful).
        `,
      },
      {
        role: "user",
        content: `PAGE TEXT DUMP:\n\n${text.substring(0, 15000)}` // Limit token usage
      },
    ],
  });

  const content = response.choices[0]?.message.content;
  if (!content) throw new Error("AI returned empty response");
  
  return JSON.parse(content);
}