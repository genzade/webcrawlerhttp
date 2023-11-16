const { JSDOM } = require("jsdom");

async function crawlPage(baseURL, currentURL, pages) {
	const baseURLObj = new URL(baseURL);
	const currentURLObj = new URL(currentURL);

	// If the base URL and current URL are not on the same domain, return.
	if (baseURLObj.hostname !== currentURLObj.hostname) {
		return pages;
	}

	const normalizedCurrentURL = normalizeURL(currentURL);

	// If the page has already been crawled, increment the count and return.
	if (pages[normalizedCurrentURL] > 0) {
		pages[normalizedCurrentURL]++;
		return pages;
	}

	// If the page has not been crawled, add it to the pages object and crawl it.
	pages[normalizedCurrentURL] = 1;

	console.log(`Crawling page: ${currentURL}`);

	// Fetch the page and get the URLs from the HTML.
	try {
		const response = await fetch(currentURL);

		if (response.status > 399) {
			console.log(`Error: ${response.status} on page: ${currentURL}`);
			return;
		}

		const contentType = response.headers.get("content-type");

		if (!contentType.includes("text/html")) {
			console.log(`Error: ${contentType} on page: ${currentURL}`);
			return;
		}

		const htmlBody = await response.text();
		const nextUrls = getURLsFromHTML(htmlBody, baseURL);

		// Recursively crawl the next URLs.
		for (const nextUrl of nextUrls) {
			await crawlPage(baseURL, nextUrl, pages);
		}
	} catch (error) {
		console.log(`Error in fetch: ${error.message}, on page: ${currentURL}`);
	}

	return pages;
}

function getURLsFromHTML(htmlBody, baseURL) {
	const urls = [];
	const dom = new JSDOM(htmlBody);
	const linkElements = dom.window.document.querySelectorAll("a");

	for (const linkElement of linkElements) {
		if (linkElement.href.startsWith("/")) {
			try {
				const urlObj = new URL(`${baseURL}${linkElement.href}`);
				urls.push(urlObj.href);
			} catch (error) {
				console.log(`Error: ${error.message}`);
			}
		} else {
			try {
				const urlObj = new URL(linkElement.href);
				urls.push(urlObj.href);
			} catch (error) {
				console.log(`Error: ${error.message}`);
			}
		}
	}

	return urls;
}

function normalizeURL(urlString) {
	const urlObj = new URL(urlString);
	const hostPath = `${urlObj.hostname}${urlObj.pathname}`;

	return hostPath.replace(/\/$/, "");
}

module.exports = {
	crawlPage,
	getURLsFromHTML,
	normalizeURL,
};
