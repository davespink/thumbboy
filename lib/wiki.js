





async function searchWikimediaImagesFiltered(query, limit = 10) {
    // Step 1: Search for files matching the query
    const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&list=search&srsearch=file:${encodeURIComponent(query)}&srlimit=${limit}`;
    const searchResp = await fetch(searchUrl);
    const searchData = await searchResp.json();
    const titles = searchData.query.search.map(item => item.title);

    // Step 2: Get image info (direct URLs and MIME types)
    const titlesParam = titles.map(t => encodeURIComponent(t)).join('|');
    const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&prop=imageinfo&iiprop=url|mime&titles=${titlesParam}`;
    const infoResp = await fetch(infoUrl);
    const infoData = await infoResp.json();

    // Step 3: Filter for image MIME types
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/svg+xml"
    ];
    const images = [];
    for (const pageId in infoData.query.pages) {
        const page = infoData.query.pages[pageId];
        if (
            page.imageinfo &&
            page.imageinfo[0].url &&
            allowedTypes.includes(page.imageinfo[0].mime)
        ) {
            images.push({
                title: page.title,
                url: page.imageinfo[0].url,
                mime: page.imageinfo[0].mime
            });
        }
    }
    return images; // Array of {title, url, mime}
}

// Retry logic for image loading



/*
function createImageWithRetry(src, alt, title, maxRetries = 2) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.title = title;
    img.style.maxWidth = '200px';
    img.style.maxHeight = '200px';
    let retries = 0;
    img.onerror = function () {
        if (retries < maxRetries) {
            retries++;
            setTimeout(() => { img.src = src + (src.includes('?') ? '&' : '?') + 'retry=' + retries; }, 500);
        } else {
            img.style.display = 'none';
            const retryBtn = document.createElement('button');
            retryBtn.textContent = 'Retry';
            retryBtn.onclick = function () {
                img.style.display = '';
                img.src = src + (src.includes('?') ? '&' : '?') + 'retry=' + (retries + 1);
                retryBtn.remove();
            };
            img.parentNode.insertBefore(retryBtn, img.nextSibling);
        }
    };
    return img;
}

try {
    const images = await searchWikimediaImagesFiltered(query, 10);
    console.log(images); // Only image files
    images.forEach(element => {
        const imgElement = createImageWithRetry(element.url, element.title, element.title);
        resultsDiv.appendChild(imgElement);
    });
} catch (e) {
    resultsDiv.innerHTML = '<div style="color:red">Error loading images.</div>';
} finally {
    loadingDiv.style.display = 'none';
}
*/
