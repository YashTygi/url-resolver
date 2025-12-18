import type { Page } from "playwright"
export async function parseJsonLd(page: Page) {
  const jsonLdScript: Array<any> = await page.evaluate(() => {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    const jsonLd = Array.from(scripts).map(s => {
      try { return JSON.parse(s.innerHTML); } catch { return null; }
    }).filter(Boolean);
    return jsonLd;
  });
  if (jsonLdScript && jsonLdScript.length > 0) {
    const jsonLdContent = JSON.stringify(jsonLdScript[0]);
    try {
      return JSON.parse(jsonLdContent);
    } catch (e) {
      console.error("Failed to parse JSON-LD:", e);
      return null;
    }
  }
  return null;
}