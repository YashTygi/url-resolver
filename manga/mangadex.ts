export async function resolveMangaDexUrl(id: string): Promise<Object> {
    // Implement MangaDex specific URL resolution logic here
    // For example, convert chapter URLs to series URLs
    var data = {};
    const res = await fetch("https://api.mangadex.org/manga/" + id, {
        method: "GET",
        headers: {
        "Accept": "application/json",
        },
    });
    if (res.ok) {
        data = await res.json();
        console.log("MangaDex data fetched:", data);
    }
    return data;
}