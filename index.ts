import express from 'express';
import { chromium } from 'playwright';
import * as cheerio from 'cheerio';
import { parseWithAI } from './aiParser';
import { parseMetaData } from './parser/metaParser';
import { parseJsonLd } from './parser/jsonLdParser';
import { normaliseUrl } from './urlNormalizer';

const app = express();
const port = 3000;

app.use(express.json());

const log = (tag: string, msg: any) => console.log(`[${new Date().toLocaleTimeString()}] [${tag}] ${msg}`);

app.post("/resolve", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    res.status(400).send({ error: "URL is required" });
    return;
  }

  log("REQ", `Processing: ${url}`);
  let browser;
  
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();

    // 1. Visit the Initial URL
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 25000 });
    
    // --- SMART HOP: Check if this is a Chapter Page ---
    const pageTitle = await page.title();
    const urlLower = url.toLowerCase();
    const jsonLdScript = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script'));
      return scripts.find(script => script.type === 'application/ld+json');
    });
    const isChapterPage = urlLower.includes("chapter") || urlLower.includes("episode") || /\d+$/.test(urlLower);

    const res = await normaliseUrl(page, url);

    console.log("Normalized URL:", res);

    // const jsonLd = await parseJsonLd(page);
    // const metaData = await parseMetaData(page);

    // console.log("meta tags:", metaData,  "jsonLdScript" ,jsonLd);

    // console.log("page meta data: ");
    // const meta = await page.evaluate(() => {
    //   const metaTags = Array.from(document.querySelectorAll('meta'));
    //   const data: any = {};
    //   metaTags.forEach(tag => {
    //     const name = tag.getAttribute('name');
    //     const property = tag.getAttribute('property');
    //     const content = tag.getAttribute('content');
    //     if (name) data[name] = content;
    //     if (property) data[property] = content;
    //   });
    //   return data;
    // });

    // 
    
    // let targetedChapter = null; // <--- NEW: Store the specific chapter

    // if (isChapterPage) {
    //   log("NAV", "Detected Chapter Page. Attempting to identify chapter and find Series Home...");
      
    //   // 1. Extract the specific chapter name BEFORE navigating away
    //   // Try Title First: "Solo Leveling Chapter 10 - Asura" -> "Chapter 10"
    //   const titleMatch = pageTitle.match(/(Chapter|Episode)\s*(\d+(\.\d+)?)/i);
    //   if (titleMatch) {
    //      // titleMatch[0] is "Chapter 10"
    //      targetedChapter = titleMatch[0]; 
    //   } else {
    //      // Fallback: Check URL for "chapter-123" or "episode-123"
    //      const urlMatch = urlLower.match(/(chapter|episode)[-/_.]?(\d+(\.\d+)?)/);
    //      if (urlMatch) {
    //         targetedChapter = `${urlMatch[1]} ${urlMatch[2]}`; // "chapter 123"
    //      }
    //   }
      
    //   // Capitalize first letter (aesthetic)
    //   if (targetedChapter) {
    //     targetedChapter = targetedChapter.replace(/\b\w/g, l => l.toUpperCase());
    //     log("NAV", `🎯 Targeted Chapter Identified: ${targetedChapter}`);
    //   }

    //   // 2. Hop to Series Page
    //   const seriesUrl = await page.evaluate(() => {
    //     const anchors = Array.from(document.querySelectorAll('a'));
    //     // Priority 1: Breadcrumbs
    //     const crumb = anchors.find(a => 
    //       a.className.includes('breadcrumb') || 
    //       a.parentElement?.className.includes('breadcrumb')
    //     );
    //     if (crumb) return crumb.href;

    //     // Priority 2: Standard "All Chapters" or Series Title links
    //     // (This regex looks for links back to the series root)
    //     return null; 
    //   });

    //   if (seriesUrl && seriesUrl !== url) {
    //     log("NAV", `Hopping to Series Page: ${seriesUrl}`);
    //     await page.goto(seriesUrl, { waitUntil: "domcontentloaded" });
    //   } else {
    //     log("NAV", "Could not find Series link automatically. Parsing current page.");
    //   }
    // }

    // // 2. Extract Data for AI
    // const bodyText = await page.evaluate(() => document.body.innerText);

    // const rawImage = await page.evaluate(() => {
    //   // Helper to make absolute URL
    //   const toAbsolute = (src: any) => {
    //     if (!src) return null;
    //     try { return new URL(src, document.baseURI).href; } catch { return null; }
    //   };

    //   // Selectors
    //   const metaImg = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
    //   const webtoonImg = document.querySelector('.summary_image img')?.getAttribute('src');
    //   const firstImg = document.querySelector('img')?.getAttribute('src');

    //   return toAbsolute(metaImg) || toAbsolute(webtoonImg) || toAbsolute(firstImg);
    // });

    // await browser.close();
    // browser = null;

    // // 3. Ask AI to make sense of it
    // log("AI", "Sending text to LLM...");
    // const aiData = await parseWithAI(bodyText, url);
    
    // // 4. Merge Data
    // const finalData = {
    //   ...aiData,
    //   coverUrl: rawImage || "",
    //   sourceUrl: url,
    //   targetedChapter: targetedChapter // <--- Include this in response
    // };

    // log("DONE", `Extracted: ${finalData.title} | Target: ${finalData.targetedChapter}`);
    // res.json(finalData);

  } catch (error: any) {
    if (browser) await browser.close();
    log("ERR", error.message);
    res.status(500).send({ error: "Extraction Failed", details: error.message });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`\n🤖 AI Scraper running on http://0.0.0.0:${port}\n`);
});