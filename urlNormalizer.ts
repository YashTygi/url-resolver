import type {Page} from "playwright";
import { resolveMangaDexUrl } from "./manga/mangadex";

export async function normaliseUrl(page: Page, url: string){

    // Implement URL normalization logic here
    const lowerUrl = url.toLowerCase();
    const isLikelyChapter = /chapter|episode|-\d+$/i.test(lowerUrl) || /\/read\//.test(lowerUrl);




    const breadcrumbLinks = await page.evaluate(() => {
        const breadcrumbElements = Array.from(document.querySelectorAll('nav.breadcrumb a, .breadcrumb a, .breadcrumbs a, #breadcrumbs a, a[itemprop="item"]'));
        return breadcrumbElements.map(el => (el as HTMLAnchorElement).href);
        }
    );

        if(lowerUrl.includes("mangadex")) {
            const urlObj = new URL(lowerUrl);
            const parts = urlObj.pathname.split("/").filter(Boolean);

            // parts = ["title", "<uuid>", "slug"]
            const id = parts[1];
            const data = await resolveMangaDexUrl(id || "");
            console.log("Resolved MangaDex URL:", data);
            const normalisedUrl = url.replace(
            /^(https?:\/\/[^\/]+\/.*?)(?:\/(chapter|episode)[^\/]*)\/?/,
            '$1'
        );
        console.log("Normalizing URL from chapter to series:", url, "->", normalisedUrl);
        return normalisedUrl;
    }
    
    console.log("Normalizing URL:", url, "Is likely chapter:", "\n" , isLikelyChapter, "\n", "Breadcrumbs found:", breadcrumbLinks);
      
    return url;
}