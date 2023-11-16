const { JSDOM } = require("jsdom");

async function crawlPage(currentURL) {
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

		console.log(await response.text());
	} catch (error) {
		console.log(`Error in fetch: ${error.message}, on page: ${currentURL}`);
	}
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
