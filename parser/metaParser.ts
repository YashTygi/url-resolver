import type {Page} from "playwright";

export async function parseMetaData(page: Page) {
    const meta = await page.evaluate(() => {
      const metaTags = Array.from(document.querySelectorAll('meta'));
      const data: any = {};
      metaTags.forEach(tag => {
        const name = tag.getAttribute('name');
        const property = tag.getAttribute('property');
        const content = tag.getAttribute('content');
        if (name) data[name] = content;
        if (property) data[property] = content;
      });
    //   console.log("Extracted meta tags:", data);
      return data;
    });
    // console.log("Meta data parsed:", meta);
    return meta;
}